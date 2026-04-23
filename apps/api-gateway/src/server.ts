import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import proxy from 'express-http-proxy';
import dotenv from 'dotenv';
import logger from './utils/logger';
import errorHandler from './middlewares/error.middleware';
import https from 'https';
import { rateLimit } from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ENABLE_HTTPS = process.env.ENABLE_HTTPS === 'true';

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

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
