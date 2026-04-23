import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import logger from './utils/logger';
import errorHandler from './middlewares/error.middleware';
import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'task-service' });
});

// Routes
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);


app.listen(PORT, () => {
  logger.info(`Task Service running on port ${PORT}`);
});
