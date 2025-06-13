require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { errorHandler } = require('./presentation/middlewares/errorHandler');
const tripRoutes = require('./presentation/routes/tripRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/trips', tripRoutes);

// Global error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
