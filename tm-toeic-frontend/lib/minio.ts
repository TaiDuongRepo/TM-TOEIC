import { Client } from 'minio'

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT?.split(':')[0] || 'localhost',
  port: parseInt(process.env.MINIO_ENDPOINT?.split(':')[1] || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
})

const bucketName = process.env.MINIO_BUCKET_NAME || 'toeic-files'

// Ensure bucket exists
export const ensureBucket = async () => {
  try {
    const exists = await minioClient.bucketExists(bucketName)
    if (!exists) {
      await minioClient.makeBucket(bucketName, 'us-east-1')
      console.log(`Bucket ${bucketName} created successfully`)
    }
  } catch (error) {
    console.error('Error ensuring bucket exists:', error)
  }
}

export { minioClient, bucketName }

