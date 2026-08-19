import path from 'path';
import mime from 'mime-types';
import { randomUUID } from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3, resolveFileBodyAndName } from '@/services/backend/s3/helpers';

export async function uploadToS3({ file, folder = '', bucketName = process.env.AWS_S3_BUCKET, fileName = null, allowedExtensions = [] }) {
  if (!file) {
    throw new Error('File is required');
  }

  const { body, originalName } = await resolveFileBodyAndName(file, fileName);
  const extension = path.extname(originalName).toLowerCase();
  if (extension && allowedExtensions.length > 0 && !allowedExtensions.includes(extension)) {
    throw new Error(`Unsupported file type: ${extension}`);
  }

  const finalFileName = fileName || `${Date.now()}-${randomUUID()}${extension}`;
  const key = folder ? `${folder.replace(/^\/|\/$/g, '')}/${finalFileName}` : finalFileName;
  const contentType = mime.lookup(extension) || 'application/octet-stream';

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
      Body: body,
    })
  );

  return {
    success: true,
    bucket: bucketName,
    key,
    fileName: finalFileName,
    contentType,
    url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  };
}

export async function getPresignedUploadUrl({ bucketName = process.env.AWS_S3_BUCKET, restaurantId, targetFolder = "temp", filename, contentType, expiresIn = 600 }) {
  const originalName = String(filename).trim().slice(0, 100);
  const cleanFilename = originalName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.+/g, '.')
    .replace(/^\.+|\.+$/g, '');

  const baseName = cleanFilename.replace(/\.[^/.]+$/, '') || 'image';
  const extension = path.extname(originalName).replace('.', '').toLowerCase() || 'jpg';

  const imageId = randomUUID();

  const folder = targetFolder.replace(/^\/|\/$/g, '');
  const key = `restaurant/${restaurantId}/${folder}/${imageId}_${baseName}.${extension}`;
 
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn });

  return {
    uploadUrl,
    key,
    imageId,
    cleanFilename,
  };
}
