/**
 * Starts a local, persistent MongoDB server for development using the mongod binary
 * that `mongodb-memory-server` downloads (no system-wide MongoDB install needed).
 *
 *   npm run db            -> listens on the port from MONGO_URI (default 27017)
 *
 * Data is stored in backend/.data/db (git-ignored) and survives restarts.
 * If you already run MongoDB (Docker, Atlas, installed service), you do not need this.
 */
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
require('dotenv').config({ quiet: true });

const { MongoBinary } = require('mongodb-memory-server-core');

const getPort = () => {
  try {
    return Number(new URL(process.env.MONGO_URI).port) || 27017;
  } catch {
    return 27017;
  }
};

(async () => {
  const port = getPort();
  const dbPath = path.join(__dirname, '..', '.data', 'db');
  fs.mkdirSync(dbPath, { recursive: true });

  console.log('Locating mongod binary (downloaded on first use)...');
  const binary = await MongoBinary.getPath();

  console.log(`Starting MongoDB on 127.0.0.1:${port} (data: ${dbPath})`);
  const child = spawn(binary, ['--dbpath', dbPath, '--port', String(port), '--bind_ip', '127.0.0.1'], {
    stdio: 'inherit',
  });

  child.on('exit', (code) => process.exit(code ?? 0));
  const stop = () => child.kill('SIGINT');
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
})().catch((err) => {
  console.error('Failed to start MongoDB:', err.message);
  process.exit(1);
});
