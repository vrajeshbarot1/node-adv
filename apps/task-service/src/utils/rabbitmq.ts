import amqp, { Connection, Channel } from 'amqplib';
import logger from './logger';

let connection: Connection;
let channel: Channel;

export const connectRabbitMQ = async () => {
  try {
    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    
    // Ensure the queue exists
    await channel.assertQueue('notifications', { durable: true });
    
    logger.info('Connected to RabbitMQ in Task Service');
    
    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error', err);
    });
    
    connection.on('close', () => {
      logger.warn('RabbitMQ connection closed. Attempting to reconnect...');
      setTimeout(connectRabbitMQ, 5000);
    });

  } catch (error) {
    logger.error('Failed to connect to RabbitMQ', error);
    setTimeout(connectRabbitMQ, 5000);
  }
};

export const publishToQueue = async (queue: string, message: any) => {
  try {
    if (!channel) {
      logger.error('RabbitMQ channel not initialized');
      return;
    }
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    logger.info(`Message published to queue ${queue}`);
  } catch (error) {
    logger.error(`Failed to publish message to queue ${queue}`, error);
  }
};
