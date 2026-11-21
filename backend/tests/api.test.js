const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.JWT_SECRET = 'test-secret';
process.env.MONGO_URI = 'mongodb://unused-in-tests';
process.env.AUTH_RATE_LIMIT = '1000';

let mongod;
let server;
let base;

const api = async (method, path, { token, body } = {}) => {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json() };
};

const register = async (name) => {
  const { data } = await api('POST', '/auth/register', {
    body: { name, email: `${name}@example.com`, password: 'secret123' },
  });
  return data;
};

const itemBody = (overrides = {}) => ({
  name: 'Lamp',
  image: 'http://img/lamp.png',
  description: 'A lamp',
  category: 'Home',
  price: 10,
  quantity: 5,
  ...overrides,
});

const address = { fullName: 'Bob', address: '1 Main St', city: 'Town', postalCode: '123', country: 'PH' };

before(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  const app = require('../app');
  server = app.listen(0);
  base = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
  server.close();
  await mongoose.disconnect();
  await mongod.stop();
});

test('auth: register, duplicate, login, me, bad credentials', async () => {
  const alice = await register('alice');
  assert.ok(alice.token);
  assert.equal(alice.user.email, 'alice@example.com');
  assert.equal(alice.user.password, undefined);

  const dup = await api('POST', '/auth/register', {
    body: { name: 'alice', email: 'ALICE@example.com', password: 'secret123' },
  });
  assert.equal(dup.status, 400);

  const short = await api('POST', '/auth/register', { body: { name: 'x', email: 'x@y.com', password: '123' } });
  assert.equal(short.status, 400);

  const login = await api('POST', '/auth/login', { body: { email: 'alice@example.com', password: 'secret123' } });
  assert.equal(login.status, 200);

  const bad = await api('POST', '/auth/login', { body: { email: 'alice@example.com', password: 'nope' } });
  assert.equal(bad.status, 400);
  assert.equal(bad.data.msg, 'Invalid email or password');

  const me = await api('GET', '/auth/me', { token: login.data.token });
  assert.equal(me.data.user.name, 'alice');

  assert.equal((await api('GET', '/auth/me')).status, 401);
});

test('items: create, ownership, search/filter, update, delete', async () => {
  const seller = await register('seller');
  const other = await register('other');

  const created = await api('POST', '/items', { token: seller.token, body: itemBody({ reviews: [{ rating: 5 }] }) });
  assert.equal(created.status, 201);
  assert.equal(created.data.reviews.length, 0, 'reviews cannot be mass-assigned');
  assert.equal(created.data.user, seller.user.id);

  assert.equal((await api('POST', '/items', { body: itemBody() })).status, 401);
  assert.equal((await api('POST', '/items', { token: seller.token, body: itemBody({ price: -1 }) })).status, 400);

  await api('POST', '/items', { token: seller.token, body: itemBody({ name: 'Desk', category: 'Office', price: 99 }) });

  const all = await api('GET', '/items');
  assert.equal(all.data.total, 2);
  assert.equal(all.data.items[0].reviews, undefined);

  assert.equal((await api('GET', '/items?search=desk')).data.total, 1);
  assert.equal((await api('GET', '/items?category=Home')).data.total, 1);
  assert.equal((await api('GET', '/items?sort=price-desc')).data.items[0].name, 'Desk');
  assert.deepEqual((await api('GET', '/items/categories')).data, ['Home', 'Office']);
  assert.equal((await api('GET', '/items/myitems', { token: seller.token })).data.length, 2);
  assert.equal((await api('GET', '/items/myitems', { token: other.token })).data.length, 0);

  const id = created.data._id;
  assert.equal((await api('GET', '/items/not-an-id')).status, 404);
  assert.equal((await api('PUT', `/items/${id}`, { token: other.token, body: { price: 1 } })).status, 403);
  const updated = await api('PUT', `/items/${id}`, { token: seller.token, body: { price: 12, user: other.user.id } });
  assert.equal(updated.data.price, 12);
  assert.equal(updated.data.user, seller.user.id);

  assert.equal((await api('DELETE', `/items/${id}`, { token: other.token })).status, 403);
  assert.equal((await api('DELETE', `/items/${id}`, { token: seller.token })).status, 200);
  assert.equal((await api('GET', `/items/${id}`)).status, 404);
});

test('reviews: validation, own item, duplicates, average', async () => {
  const seller = await register('rvseller');
  const buyer = await register('rvbuyer');
  const { data: item } = await api('POST', '/items', { token: seller.token, body: itemBody() });
  const path = `/items/${item._id}/reviews`;

  assert.equal((await api('POST', path, { token: seller.token, body: { rating: 5, comment: 'mine' } })).status, 403);
  assert.equal((await api('POST', path, { token: buyer.token, body: { rating: 9, comment: 'x' } })).status, 400);
  assert.equal((await api('POST', path, { token: buyer.token, body: { rating: 4, comment: '  ' } })).status, 400);

  const ok = await api('POST', path, { token: buyer.token, body: { rating: 4, comment: 'Nice' } });
  assert.equal(ok.status, 201);
  assert.equal(ok.data.reviews[0].author, 'rvbuyer');
  assert.equal(ok.data.averageRating, 4);

  assert.equal((await api('POST', path, { token: buyer.token, body: { rating: 5, comment: 'again' } })).status, 409);
});

test('orders: stock reservation, overselling, own items, cancel restocks', async () => {
  const seller = await register('osell');
  const buyer = await register('obuyer');
  const { data: item } = await api('POST', '/items', { token: seller.token, body: itemBody({ quantity: 3 }) });

  const place = (token, qty, id = item._id) =>
    api('POST', '/orders', { token, body: { items: [{ id, quantity: qty }], shippingAddress: address } });

  assert.equal((await place(buyer.token, 1)).status, 201);
  assert.equal((await place(seller.token, 1)).status, 400, 'cannot buy own item');
  assert.equal((await place(buyer.token, 5)).status, 409, 'cannot oversell');
  assert.equal((await api('POST', '/orders', { token: buyer.token, body: { items: [], shippingAddress: address } })).status, 400);
  assert.equal(
    (await api('POST', '/orders', { token: buyer.token, body: { items: [{ id: item._id, quantity: 1 }] } })).status,
    400
  );

  // A failing second line must roll back the first reservation
  const multi = await api('POST', '/orders', {
    token: buyer.token,
    body: {
      items: [
        { id: item._id, quantity: 1 },
        { id: new mongoose.Types.ObjectId().toString(), quantity: 1 },
      ],
      shippingAddress: address,
    },
  });
  assert.equal(multi.status, 404);
  assert.equal((await api('GET', `/items/${item._id}`)).data.quantity, 2);

  const second = await place(buyer.token, 2);
  assert.equal(second.status, 201);
  assert.equal(second.data.totalPrice, 20);
  assert.equal((await api('GET', `/items/${item._id}`)).data.quantity, 0);

  const orders = await api('GET', '/orders', { token: buyer.token });
  assert.equal(orders.data.length, 2);
  assert.equal((await api('GET', '/orders', { token: seller.token })).data.length, 0);
  assert.equal((await api('GET', `/orders/${second.data._id}`, { token: seller.token })).status, 404);

  const cancelled = await api('PATCH', `/orders/${second.data._id}/cancel`, { token: buyer.token });
  assert.equal(cancelled.data.status, 'cancelled');
  assert.equal((await api('GET', `/items/${item._id}`)).data.quantity, 2);
  assert.equal((await api('PATCH', `/orders/${second.data._id}/cancel`, { token: buyer.token })).status, 400);
});

test('public user profile hides sensitive fields', async () => {
  const user = await register('pub');
  const { status, data } = await api('GET', `/user/${user.user.id}`);
  assert.equal(status, 200);
  assert.equal(data.name, 'pub');
  assert.equal(data.email, undefined);
  assert.equal((await api('GET', '/nope')).status, 404);
});
