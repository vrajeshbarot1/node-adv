import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import proxy from 'express-http-proxy';
import dotenv from 'dotenv';
import logger from './utils/logger';
import errorHandler from './middlewares/error.middleware';
import https from 'https';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ENABLE_HTTPS = process.env.ENABLE_HTTPS === 'true';

app.use(helmet());
app.use(cors());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

const proxyOptions = {
  proxyReqPathResolver: (req: any) => {
    return req.originalUrl.replace('/v1', '/api');
  }
};

// Proxy routes
app.use('/v1/auth', proxy(process.env.AUTH_SERVICE_URL as string, proxyOptions));
app.use('/v1/users', proxy(process.env.USER_SERVICE_URL as string, proxyOptions));
app.use('/v1/tasks', proxy(process.env.TASK_SERVICE_URL as string, proxyOptions));
app.use('/v1/files', proxy(process.env.FILE_SERVICE_URL as string, proxyOptions));
app.use('/v1/notifications', proxy(process.env.NOTIFICATION_SERVICE_URL as string, proxyOptions));

app.use(errorHandler);

if (ENABLE_HTTPS) {
  const options = {
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT
  };
  https.createServer(options, app).listen(PORT, () => {
    logger.info(`API Gateway running on port ${PORT} (HTTPS)`);
  });
} else {
  app.listen(PORT, () => {
    logger.info(`API Gateway running on port ${PORT} (HTTP)`);
  });
}
