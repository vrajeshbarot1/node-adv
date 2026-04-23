import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const uploadFileToS3 = async (file: Express.Multer.File): Promise<string> => {
  const bucketName = process.env.AWS_S3_BUCKET as string;
  const key = `${Date.now()}-${file.originalname}`;

  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });

    await upload.done();

    // Construct the file URL (assuming public access or providing a signed URL)
    // For simplicity, we return the standard S3 URL
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    logger.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};
