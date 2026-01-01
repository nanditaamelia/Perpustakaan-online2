import { v2 as cloudinary } from 'cloudinary';
import { logInfo, logError, logWarn } from './logger';
import fs from 'fs';
import path from 'path';

const CLOUDINARY_ENABLED =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (CLOUDINARY_ENABLED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  logInfo('Cloudinary configured successfully');
} else {
  logWarn('Cloudinary credentials not found. Using local file storage.');
}

export async function uploadImage(fileBuffer, fileName, folder = 'library') {
  try {
    if (CLOUDINARY_ENABLED) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `perpustakaan-online/${folder}`,
            public_id: fileName.split('.')[0],
            resource_type: 'image',
            transformation: [
              { width: 800, height: 1200, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) {
              logError(error, { context: 'cloudinary-upload', fileName });
              reject(error);
            } else {
              logInfo('Image uploaded to Cloudinary', {
                fileName,
                url: result.secure_url,
              });
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
              });
            }
          }
        );

        uploadStream.end(fileBuffer);
      });
    } else {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${fileName}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      fs.writeFileSync(filePath, fileBuffer);

      const url = `/uploads/${folder}/${uniqueFileName}`;
      logInfo('Image uploaded to local storage', { fileName, url });

      return {
        url,
        publicId: uniqueFileName,
        width: null,
        height: null,
        format: path.extname(fileName).slice(1),
      };
    }
  } catch (error) {
    logError(error, { context: 'upload-image', fileName });
    throw new Error('Failed to upload image');
  }
}

export async function deleteImage(publicId) {
  try {
    if (CLOUDINARY_ENABLED) {
      const result = await cloudinary.uploader.destroy(publicId);
      logInfo('Image deleted from Cloudinary', { publicId, result });
      return result;
    } else {
      const filePath = path.join(process.cwd(), 'public', publicId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logInfo('Image deleted from local storage', { publicId });
      }
      return { result: 'ok' };
    }
  } catch (error) {
    logError(error, { context: 'delete-image', publicId });
    throw new Error('Failed to delete image');
  }
}

export function validateImage(file, maxSize = 5 * 1024 * 1024) {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg,image/webp').split(',');

  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return path;
}

export const isCloudinaryEnabled = () => CLOUDINARY_ENABLED;

export default {
  uploadImage,
  deleteImage,
  validateImage,
  getImageUrl,
  isCloudinaryEnabled,
};
