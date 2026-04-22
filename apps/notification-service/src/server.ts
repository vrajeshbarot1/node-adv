import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import logger from './utils/logger';
import errorHandler from './middlewares/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Notification Service running on port ${PORT}`);
});
