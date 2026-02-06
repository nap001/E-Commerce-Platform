const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const itemsRouter = require('./routes/items');
const authRouter = require('./routes/auth'); // 👈 Import auth router
const userRouter = require('./routes/User');
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/items', itemsRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter)
// ✅ Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB");

  // Start Express server only after DB connection
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});
