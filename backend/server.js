const mongoose = require('mongoose');
const env = require('./config/env');
const app = require('./app');

mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start accepting requests only once the database is available
    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
