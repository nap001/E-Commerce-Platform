/**
 * Seeds the database with demo users, 100 items and some reviews.
 *
 *   npm run seed            -> adds the demo data (refuses if demo data already exists)
 *   npm run seed -- --reset -> removes previous demo data first, then re-seeds
 *
 * Only data belonging to the demo users below is ever deleted.
 * All demo accounts use the password "password123".
 * Data is generated from a fixed random seed, so every run produces the same catalogue.
 */
const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');
const Item = require('../models/Items');
const Order = require('../models/Order');

const PASSWORD = 'password123';

const DEMO_USERS = [
  { name: 'Alice Morgan', email: 'alice@example.com' },
  { name: 'Ben Carter', email: 'ben@example.com' },
  { name: 'Chloe Nguyen', email: 'chloe@example.com' },
  { name: 'Daniel Reyes', email: 'daniel@example.com' },
  { name: 'Emma Schultz', email: 'emma@example.com' },
  { name: 'Farid Haddad', email: 'farid@example.com' },
];

// [name, price (USD), description]
const CATALOG = {
  Electronics: [
    ['Wireless Noise-Cancelling Headphones', 129.99, 'Over-ear Bluetooth headphones with 30-hour battery life and active noise cancellation.'],
    ['Mechanical Keyboard', 89.0, 'Hot-swappable tactile switches, USB-C, white backlight and a solid aluminium frame.'],
    ['4K Webcam', 74.5, 'Ultra HD webcam with autofocus, dual microphones and a privacy shutter.'],
    ['Portable Power Bank 20000mAh', 39.99, 'Fast-charging power bank with two USB-C ports and a digital battery display.'],
    ['Smart Fitness Watch', 149.0, 'Heart-rate, sleep and GPS tracking with a bright AMOLED display and 7-day battery.'],
    ['Bluetooth Speaker', 54.9, 'Waterproof portable speaker with deep bass and 12 hours of playtime.'],
    ['Gaming Mouse', 45.0, 'Lightweight 16,000 DPI optical mouse with programmable buttons and RGB lighting.'],
    ['USB-C Docking Station', 99.0, '9-in-1 hub with HDMI, Ethernet, SD reader and 100W power delivery passthrough.'],
    ['Wireless Charging Pad', 24.99, '15W Qi charger compatible with phones and earbuds, with a non-slip surface.'],
    ['Action Camera', 119.0, 'Waterproof 4K action camera with image stabilisation and a mounting kit.'],
    ['E-Reader 6" Display', 109.0, 'Glare-free e-ink screen with adjustable warm light and weeks of battery life.'],
    ['Noise-Isolating Earbuds', 34.5, 'In-ear wired earbuds with inline remote, three ear-tip sizes and a carry pouch.'],
    ['Smart LED Light Bulb 4-Pack', 29.99, 'Wi-Fi colour bulbs controllable by app or voice, 16 million colours.'],
  ],
  Home: [
    ['Adjustable LED Desk Lamp', 24.5, 'Warm-to-cool LED lamp with a flexible arm, touch dimmer and USB charging port.'],
    ['Ceramic Coffee Mug Set (4)', 28.0, 'Handmade-style stoneware mugs, 350 ml each, dishwasher and microwave safe.'],
    ['Memory Foam Pillow', 32.99, 'Contoured cooling pillow that supports your neck, with a washable bamboo cover.'],
    ['Cotton Throw Blanket', 36.0, 'Soft woven throw in a neutral tone, perfect for the sofa or the foot of the bed.'],
    ['Stainless Steel Cookware Set', 119.0, '10-piece induction-ready set with glass lids and riveted handles.'],
    ['Aroma Diffuser', 26.5, 'Ultrasonic essential-oil diffuser with seven ambient light colours and auto shut-off.'],
    ['Bamboo Cutting Board', 21.0, 'Large reversible chopping board with a juice groove and built-in handle.'],
    ['Floating Wall Shelves (Set of 3)', 33.0, 'Solid pine shelves with hidden brackets, easy to mount, holds up to 15 kg each.'],
    ['Robot Vacuum Cleaner', 179.0, 'Self-charging robot vacuum with app scheduling, 2,500 Pa suction and pet-hair brush.'],
    ['Electric Kettle 1.7L', 38.0, 'Rapid-boil stainless steel kettle with temperature presets and keep-warm mode.'],
    ['Cast Iron Skillet 12"', 41.0, 'Pre-seasoned skillet that goes from stove to oven to campfire and lasts for decades.'],
    ['Storage Baskets (Set of 3)', 27.5, 'Woven fabric baskets for closets and shelves, collapsible with sturdy handles.'],
    ['Wall Clock, Minimalist', 22.0, 'Silent-sweep 30 cm wall clock with a matte black frame and clear dial.'],
  ],
  Fashion: [
    ['Classic Denim Jacket', 59.0, 'Mid-weight cotton denim jacket with a timeless fit and brushed-metal buttons.'],
    ['Leather Bifold Wallet', 34.0, 'Full-grain leather wallet with RFID protection, eight card slots and a coin pocket.'],
    ['Canvas Backpack 25L', 49.5, 'Water-resistant daypack with a padded laptop sleeve and anti-theft back pocket.'],
    ['Running Sneakers', 79.0, 'Breathable mesh trainers with responsive cushioning and a durable rubber outsole.'],
    ['Wool Beanie', 17.5, 'Warm ribbed-knit beanie in merino blend, one size fits most.'],
    ['Polarised Sunglasses', 38.0, 'UV400 lenses in a lightweight frame, supplied with a hard case and cloth.'],
    ['Cotton Crewneck T-Shirt (3-Pack)', 29.0, 'Soft pre-shrunk everyday tees with a relaxed fit, in neutral colours.'],
    ['Slim Fit Chinos', 44.0, 'Stretch cotton chinos with a tapered leg that dress up or down easily.'],
    ['Silk Scarf', 31.0, 'Lightweight printed silk scarf, hand-rolled edges, 90 x 90 cm.'],
    ['Leather Belt', 26.0, 'Genuine leather belt with a brushed nickel buckle, available in several sizes.'],
    ['Waterproof Rain Jacket', 68.0, 'Packable shell with taped seams, adjustable hood and underarm vents.'],
    ['Merino Wool Socks (5-Pack)', 24.0, 'Cushioned, odour-resistant socks that keep feet comfortable in any season.'],
    ['Analog Quartz Watch', 85.0, 'Stainless steel case, sapphire-coated glass and a genuine leather strap.'],
  ],
  Books: [
    ['The Pragmatic Programmer', 39.0, 'Classic guide to software craftsmanship, in very good condition with light shelf wear.'],
    ['Atomic Habits', 16.5, 'Practical strategies for forming good habits and breaking bad ones. Paperback.'],
    ['Sapiens: A Brief History of Humankind', 18.0, 'A sweeping history of our species from the Stone Age to the present. Paperback.'],
    ['Clean Code', 34.0, 'A handbook of agile software craftsmanship. Hardcover, no markings.'],
    ['The Hobbit Illustrated Edition', 27.0, 'Beautifully illustrated edition of Tolkien\'s classic adventure, hardcover.'],
    ['Design Patterns: Elements of Reusable Software', 42.0, 'The famous "Gang of Four" reference for object-oriented design.'],
    ['The Art of Cooking: 500 Recipes', 23.5, 'Comprehensive cookbook with step-by-step photos and weeknight shortcuts.'],
    ['Thinking, Fast and Slow', 15.0, 'Nobel laureate Daniel Kahneman on the two systems that drive how we think.'],
    ['Dune', 14.0, 'Frank Herbert\'s science-fiction masterpiece, mass-market paperback.'],
    ['Eloquent JavaScript, 3rd Edition', 31.0, 'A modern introduction to programming, with exercises in every chapter.'],
    ['Watercolor Painting for Beginners', 19.5, 'Techniques, projects and colour theory for first-time painters.'],
    ['The Lean Startup', 17.0, 'How today\'s entrepreneurs use continuous innovation to build successful businesses.'],
    ['A Brief History of Time', 13.5, 'Stephen Hawking\'s accessible guide to cosmology, black holes and the big bang.'],
  ],
  Sports: [
    ['Non-Slip Yoga Mat', 28.0, '6 mm thick eco-friendly mat with alignment lines and a carry strap.'],
    ['Adjustable Dumbbell Pair', 139.0, 'Quick-change dumbbells from 2 to 24 kg each, with a compact storage tray.'],
    ['Insulated Water Bottle 1L', 25.0, 'Vacuum-insulated steel bottle that keeps drinks cold for 24 hours.'],
    ['Resistance Bands Set', 19.99, 'Five latex bands of increasing resistance with handles, anchor and door attachment.'],
    ['Trail Running Backpack', 64.0, '12-litre hydration vest with two soft flasks and reflective details.'],
    ['Jump Rope, Speed', 12.5, 'Ball-bearing speed rope with adjustable steel cable and foam grips.'],
    ['Camping Tent (2-Person)', 112.0, 'Lightweight three-season tent with fast pitching poles and a rainfly.'],
    ['Foam Roller', 21.0, 'High-density textured roller for muscle recovery and mobility work.'],
    ['Football Size 5', 22.0, 'Machine-stitched match ball with a durable PU cover.'],
    ['Cycling Helmet', 47.0, 'Ventilated road helmet with an adjustable fit dial and removable visor.'],
    ['Badminton Racket Pair', 36.0, 'Two graphite-composite rackets with grips, shuttlecocks and a carry bag.'],
    ['Hiking Trekking Poles (Pair)', 43.0, 'Foldable aluminium poles with cork grips and tungsten tips.'],
  ],
  Toys: [
    ['Building Blocks Set (500 pcs)', 35.0, 'Compatible bricks in bright colours with a storage box and idea booklet.'],
    ['Remote Control Car', 42.0, 'Rechargeable 4WD off-road car with a 2.4 GHz controller and shock-absorbing tyres.'],
    ['Wooden Puzzle, 1000 Pieces', 24.0, 'Scenic landscape jigsaw with premium thick pieces and a poster for reference.'],
    ['Classic Chess Set', 33.5, 'Weighted pieces and a folding walnut board with felt-lined storage.'],
    ['Plush Teddy Bear 45cm', 18.0, 'Ultra-soft huggable bear, machine washable and safe for newborns.'],
    ['Kids Art Easel', 46.0, 'Double-sided wooden easel with a chalkboard, whiteboard and paper roll.'],
    ['Strategy Board Game', 39.0, 'Award-winning game for 2-4 players, ages 10 and up, about 60 minutes.'],
    ['Toy Train Set', 52.0, 'Battery-powered locomotive with 40 track pieces and wooden bridges.'],
    ['Science Experiment Kit', 29.0, '30 hands-on experiments covering chemistry, electricity and crystals.'],
    ['Dollhouse with Furniture', 74.0, 'Three-storey wooden dollhouse with 20 pieces of furniture and a family of dolls.'],
    ['Bubble Machine', 15.5, 'Automatic bubble blower producing thousands of bubbles per minute, for indoor or outdoor.'],
    ['Magnetic Drawing Board', 16.0, 'Erasable doodle board with a stylus and stamps, a great travel companion.'],
  ],
  Beauty: [
    ['Vitamin C Face Serum', 22.0, 'Brightening 15% vitamin C serum with hyaluronic acid, 30 ml.'],
    ['Natural Bristle Hair Brush', 19.5, 'Boar-bristle brush that distributes oils and adds shine, with a beech wood handle.'],
    ['Hydrating Face Moisturizer', 18.0, 'Fragrance-free daily cream with ceramides, suitable for sensitive skin.'],
    ['Electric Toothbrush', 49.0, 'Sonic toothbrush with 5 modes, 2-minute timer and 30-day battery life.'],
    ['Mineral Sunscreen SPF 50', 16.5, 'Broad-spectrum, reef-friendly sunscreen with no white cast.'],
    ['Lip Care Gift Set', 14.0, 'Four tinted balms in a recyclable tin, enriched with shea butter.'],
    ['Hair Dryer, Ionic', 58.0, '2000W professional dryer with three heat settings and a concentrator nozzle.'],
    ['Charcoal Cleansing Bar', 8.5, 'Handmade soap with activated charcoal for deep pore cleansing.'],
    ['Makeup Brush Set (12 pcs)', 27.0, 'Soft synthetic brushes for face and eyes, supplied with a travel roll case.'],
    ['Beard Grooming Kit', 31.0, 'Beard oil, balm, comb and scissors in a gift-ready wooden box.'],
    ['Rose Water Facial Mist', 11.0, 'Refreshing toner mist made from distilled rose petals, 100 ml.'],
    ['Nail Care Set', 20.0, '12-piece stainless steel manicure set in a leather case.'],
  ],
  Garden: [
    ['Cordless Pruning Shears', 54.0, 'Rechargeable shears that cut branches up to 25 mm, with two batteries.'],
    ['Ceramic Plant Pots (Set of 3)', 30.0, 'Glazed pots with drainage holes and bamboo saucers, for indoor and outdoor use.'],
    ['Garden Hose 25m, Expandable', 32.0, 'Lightweight kink-free hose with a 7-function spray nozzle.'],
    ['Raised Garden Bed', 78.0, 'Cedar planter box, 120 x 60 cm, with easy tool-free assembly.'],
    ['Solar Path Lights (8-Pack)', 36.0, 'Auto on/off LED stakes that charge in sunlight and last all night.'],
    ['Herb Garden Starter Kit', 25.0, 'Grow basil, parsley, coriander and mint with pots, soil discs and seeds included.'],
    ['Telescopic Lopper', 44.0, 'Extendable bypass lopper with ratchet action for hard-to-reach branches.'],
    ['Bird Feeder, Hanging', 17.0, 'Weatherproof feeder with a squirrel baffle and a large seed capacity.'],
    ['Garden Kneeler and Seat', 35.0, 'Folds from a padded kneeler to a seat, with tool pouches on the sides.'],
    ['Watering Can 5L', 15.0, 'Galvanised steel can with a detachable rose for gentle watering.'],
    ['Compost Bin 220L', 59.0, 'Insulated black bin with a sliding hatch to turn kitchen waste into compost.'],
    ['Leather Gardening Gloves', 13.5, 'Reinforced palms and long cuffs that protect against thorns and brambles.'],
  ],
};

const REVIEW_COMMENTS = {
  5: ['Absolutely love it, exactly as described.', 'Great quality for the price. Would buy again!', 'Arrived quickly and works perfectly.', 'Better than I expected. Highly recommended.'],
  4: ['Very good overall, only minor nitpicks.', 'Solid product, does what it says.', 'Happy with this purchase.', 'Good value, packaging could be better.'],
  3: ['It is okay, nothing special.', 'Decent, but I expected a bit more.', 'Average quality, fair price.'],
  2: ['Not as good as the photos suggest.', 'Works, but feels cheap.'],
  1: ['Disappointed, would not recommend.'],
};

// Small deterministic PRNG (mulberry32) so the seed data is reproducible
const makeRng = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const buildItems = (users) => {
  const rng = makeRng(20260101);
  const int = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];
  const items = [];

  Object.entries(CATALOG).forEach(([category, products]) => {
    products.forEach(([name, price, description]) => {
      const seller = pick(users);
      const reviewers = users.filter((u) => !u._id.equals(seller._id)).sort(() => rng() - 0.5);
      const reviewCount = rng() < 0.3 ? 0 : int(1, 4);
      const reviews = reviewers.slice(0, reviewCount).map((reviewer) => {
        // Skew towards positive ratings, like real marketplaces
        const rating = pick([5, 5, 5, 4, 4, 4, 3, 3, 2, 1]);
        return { user: reviewer._id, author: reviewer.name, rating, comment: pick(REVIEW_COMMENTS[rating]) };
      });

      items.push({
        name,
        image: `https://picsum.photos/seed/${slugify(name)}/600/400`,
        description,
        category,
        price,
        // ~8% sold out so the "out of stock" state is visible in the UI
        quantity: rng() < 0.08 ? 0 : int(1, 40),
        reviews,
        user: seller._id,
      });
    });
  });

  return items;
};

const run = async () => {
  const reset = process.argv.includes('--reset');
  await mongoose.connect(env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log(`Connected to ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`);

  const emails = DEMO_USERS.map((u) => u.email);
  const existing = await User.find({ email: { $in: emails } });

  if (existing.length > 0) {
    if (!reset) {
      console.error('Demo data already exists. Re-run with `npm run seed -- --reset` to replace it.');
      process.exitCode = 1;
      return;
    }
    const ids = existing.map((u) => u._id);
    const [items, orders, users] = await Promise.all([
      Item.deleteMany({ user: { $in: ids } }),
      Order.deleteMany({ user: { $in: ids } }),
      User.deleteMany({ _id: { $in: ids } }),
    ]);
    console.log(`Removed previous demo data: ${users.deletedCount} users, ${items.deletedCount} items, ${orders.deletedCount} orders.`);
  }

  // Use save() (via create) so passwords are hashed by the model hook
  const users = [];
  for (const u of DEMO_USERS) users.push(await User.create({ ...u, password: PASSWORD }));

  const created = await Item.insertMany(buildItems(users));

  const perCategory = created.reduce((acc, i) => ({ ...acc, [i.category]: (acc[i.category] || 0) + 1 }), {});
  console.log(`Inserted ${created.length} items:`, perCategory);
  console.log(`Demo logins (password "${PASSWORD}"): ${emails.join(', ')}`);
};

run()
  .catch((err) => {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
