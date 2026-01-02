/**
 * Unified Storage Layer
 * Priority: Vercel Blob > Cloudinary > Local Storage
 */

import { uploadToBlob, deleteFromBlob, isBlobEnabled } from './vercelBlob';
import { uploadImage as uploadToCloudinary, deleteImage as deleteFromCloudinary, isCloudinaryEnabled } from './cloudinary';
import { logInfo, logWarn } from './logger';
import fs from 'fs';
import path from 'path';

/**
 * Get storage provider based on availability
 * @returns {string} 'blob' | 'cloudinary' | 'local'
 */
export function getStorageProvider() {
  if (isBlobEnabled()) return 'blob';
  if (isCloudinaryEnabled()) return 'cloudinary';
  return 'local';
}

/**
 * Upload file using best available storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @param {string} folder - Folder/category (books, users, etc)
 * @returns {Promise<Object>} Upload result
 */
export async function uploadFile(fileBuffer, fileName, folder = 'library') {
  const provider = getStorageProvider();

  logInfo('Uploading file', { fileName, folder, provider });

  try {
    switch (provider) {
      case 'blob':
        const blobResult = await uploadToBlob(fileBuffer, fileName, folder);
        return {
          url: blobResult.url,
          publicId: blobResult.pathname,
          provider: 'vercel-blob',
          ...blobResult,
        };

      case 'cloudinary':
        const cloudinaryResult = await uploadToCloudinary(fileBuffer, fileName, folder);
        return {
          url: cloudinaryResult.url,
          publicId: cloudinaryResult.publicId,
          provider: 'cloudinary',
          ...cloudinaryResult,
        };

      case 'local':
      default:
        return uploadToLocal(fileBuffer, fileName, folder);
    }
  } catch (error) {
    logWarn('Primary storage failed, falling back', { provider, error: error.message });

    // Fallback chain
    if (provider === 'blob' && isCloudinaryEnabled()) {
      const result = await uploadToCloudinary(fileBuffer, fileName, folder);
      return { ...result, provider: 'cloudinary' };
    }

    // Final fallback to local
    return uploadToLocal(fileBuffer, fileName, folder);
  }
}

/**
 * Upload to local filesystem (fallback)
 */
function uploadToLocal(fileBuffer, fileName, folder) {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);

    // Create directory if not exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${timestamp}-${sanitizedFileName}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    fs.writeFileSync(filePath, fileBuffer);

    const url = `/uploads/${folder}/${uniqueFileName}`;

    logInfo('File uploaded to local storage', { fileName, url });

    return {
      url,
      publicId: uniqueFileName,
      provider: 'local',
      size: fileBuffer.length,
    };
  } catch (error) {
    throw new Error('Failed to upload to local storage: ' + error.message);
  }
}

/**
 * Delete file from storage
 * @param {string} urlOrPublicId - File URL or public ID
 * @param {string} provider - Storage provider (optional, auto-detect from URL)
 */
export async function deleteFile(urlOrPublicId, provider = null) {
  try {
    // Auto-detect provider from URL
    if (!provider) {
      if (urlOrPublicId.includes('vercel-storage')) {
        provider = 'blob';
      } else if (urlOrPublicId.includes('cloudinary')) {
        provider = 'cloudinary';
      } else {
        provider = 'local';
      }
    }

    logInfo('Deleting file', { urlOrPublicId, provider });

    switch (provider) {
      case 'blob':
        await deleteFromBlob(urlOrPublicId);
        break;

      case 'cloudinary':
        await deleteFromCloudinary(urlOrPublicId);
        break;

      case 'local':
        deleteFromLocal(urlOrPublicId);
        break;
    }
  } catch (error) {
    logWarn('Failed to delete file', { urlOrPublicId, provider, error: error.message });
    // Don't throw - deletion failures shouldn't break the app
  }
}

/**
 * Delete from local filesystem
 */
function deleteFromLocal(urlOrFileName) {
  try {
    // Convert URL to file path
    let filePath;
    if (urlOrFileName.startsWith('/uploads/')) {
      filePath = path.join(process.cwd(), 'public', urlOrFileName);
    } else {
      filePath = path.join(process.cwd(), 'public', 'uploads', urlOrFileName);
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logInfo('File deleted from local storage', { filePath });
    }
  } catch (error) {
    logWarn('Failed to delete local file', { urlOrFileName, error: error.message });
  }
}

/**
 * Validate file for upload
 */
export function validateFile(file, maxSize = 5 * 1024 * 1024) {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg,image/webp').split(',');

  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Max size: ${maxSize / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

export default {
  uploadFile,
  deleteFile,
  validateFile,
  getStorageProvider,
};
