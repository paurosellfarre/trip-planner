require('dotenv').config();
const express = require('express');
const cors = require('cors');

const config = require('./shared/config/config');
const logger = require('./shared/utils/logger');
const { setupSwagger } = require('./shared/config/swagger');
const { errorHandler } = require('./presentation/middlewares/errorHandler');
const tripRoutes = require('./presentation/routes/tripRoutes');

// Initialize Express app
const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/trips', tripRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Setup Swagger documentation
setupSwagger(app);

// Global error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${config.server.env} mode`);
});

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error(`Unhandled Rejection: ${error.message}`, { stack: error.stack });
  process.exit(1);
});

module.exports = app;
