import amqp, { Connection, Channel } from 'amqplib';
import logger from './logger';
import * as NotificationService from '../services/notification.service';

let connection: Connection;
let channel: Channel;

export const connectRabbitMQ = async () => {
  try {
    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    
    await channel.assertQueue('notifications', { durable: true });
    
    logger.info('Connected to RabbitMQ in Notification Service');
    
    consumeQueue();

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

const consumeQueue = async () => {
  try {
    if (!channel) return;

    logger.info('Starting to consume notifications queue');
    
    channel.consume('notifications', async (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          logger.info('Received notification event', content);
          
          await NotificationService.createNotification(content);
          
          channel.ack(msg);
        } catch (err) {
          logger.error('Error processing notification message', err);
          // Don't ack if there's a processing error so it stays in the queue or goes to DLQ
          // In a real app, you'd use a Dead Letter Queue
        }
      }
    });
  } catch (error) {
    logger.error('Error in consumeQueue', error);
  }
};
