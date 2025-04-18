const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require("dotenv").config();



// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
// Allow Vercel + local dev
const allowedOrigins = [
  "http://localhost:5173",
  "https://streammate-28za.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.options("*", cors());

app.use(helmet());
app.use(morgan('dev'));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
// const protectedRoutes = require('./routes/protectedRoutes');
// app.use('/api/protected', protectedRoutes);
const watchlistRoutes = require('./routes/watchlistRoutes');
app.use('/api/watchlist', watchlistRoutes);

const tmdbRoutes = require('./routes/tmdbRoutes');
app.use('/api/tmdb', tmdbRoutes);


// Test route
app.get('/', (req, res) => {
  res.send('StreamMate Backend is Live 🎬');
});

// MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })

mongoose.connect(process.env.MONGO_URI)

.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => console.error('MongoDB connection error:', err));
