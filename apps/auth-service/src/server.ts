import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import logger from './utils/logger';
import authRoutes from './routes/auth.routes';
import errorHandler from './middlewares/error.middleware';

dotenv.config();

const requiredEnvVars = ['JWT_SECRET', 'AUTH_DB_URL'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    logger.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - OriginalUrl: ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

// Centralized Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Auth Service running on port ${PORT}`);
});
