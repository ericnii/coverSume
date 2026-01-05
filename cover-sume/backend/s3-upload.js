const { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');
const path = require('path');

// Configure AWS S3 Client (v3)
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const bucketName = process.env.AWS_S3_BUCKET;

/**
 * Upload PDF to S3 with user-specific folder structure
 * @param {string} userId - Auth0 user ID
 * @param {string} filePath - Local file path
 * @param {string} fileType - 'resume' or 'cover'
 * @returns {Promise<string>} - S3 file URL
 */
async function uploadToS3(userId, filePath, fileType) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const fileName = `${fileType}-${Date.now()}.pdf`;
    const s3Key = `${userId}/${fileType}/${fileName}`; // Organize by userId -> fileType -> file
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: fileContent,
      ContentType: 'application/pdf',
      ACL: 'private' // Only authenticated user can access
    });

    const result = await s3Client.send(command);
    const presignedUrl = await getPresignedUrl(s3Key);
    
    console.log(`File uploaded to S3: ${presignedUrl}`);
    return presignedUrl;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}

/**
 * Get list of user's files from S3
 * @param {string} userId - Auth0 user ID
 * @returns {Promise<Array>} - List of files
 */
async function getUserFiles(userId) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: `${userId}/` // Only get files under user's folder
    });

    const result = await s3Client.send(command);
    return result.Contents || [];
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

/**
 * Generate presigned URL for downloading a file
 * @param {string} s3Key - S3 file key
 * @param {number} expiresIn - Expiration time in seconds
 * @returns {Promise<string>} - Presigned URL
 */
async function getPresignedUrl(s3Key, expiresIn = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: s3Key
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
}

module.exports = {
  uploadToS3,
  getUserFiles,
  getPresignedUrl
};
