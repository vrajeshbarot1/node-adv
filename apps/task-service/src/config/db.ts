import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.TASK_DB_URL,
});

pool.on('connect', () => {
  logger.info('PostgreSQL pool connected');
});

pool.on('error', (err: Error) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
