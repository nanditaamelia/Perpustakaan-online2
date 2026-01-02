import { put, del, list } from '@vercel/blob';
import { logInfo, logError, logWarn } from './logger';

const BLOB_ENABLED = process.env.BLOB_READ_WRITE_TOKEN !== undefined;

/**
 * Upload file to Vercel Blob Storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @param {string} folder - Folder path (books, users, etc)
 * @returns {Promise<Object>} Upload result with URL
 */
export async function uploadToBlob(fileBuffer, fileName, folder = 'library') {
  try {
    if (!BLOB_ENABLED) {
      throw new Error('Vercel Blob storage not configured. Add BLOB_READ_WRITE_TOKEN to environment variables.');
    }

    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const blobPath = `${folder}/${timestamp}-${sanitizedFileName}`;

    const blob = await put(blobPath, fileBuffer, {
      access: 'public',
      addRandomSuffix: false,
    });

    logInfo('File uploaded to Vercel Blob', {
      fileName,
      url: blob.url,
      size: fileBuffer.length,
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
      downloadUrl: blob.downloadUrl,
      size: fileBuffer.length,
    };
  } catch (error) {
    logError(error, { context: 'vercel-blob-upload', fileName });
    throw new Error('Failed to upload to Vercel Blob: ' + error.message);
  }
}

/**
 * Delete file from Vercel Blob Storage
 * @param {string} url - Blob URL to delete
 * @returns {Promise<void>}
 */
export async function deleteFromBlob(url) {
  try {
    if (!BLOB_ENABLED) {
      logWarn('Vercel Blob storage not configured. Cannot delete file.');
      return;
    }

    await del(url);
    logInfo('File deleted from Vercel Blob', { url });
  } catch (error) {
    logError(error, { context: 'vercel-blob-delete', url });
    throw new Error('Failed to delete from Vercel Blob: ' + error.message);
  }
}

/**
 * List files in Vercel Blob Storage
 * @param {string} prefix - Path prefix to filter
 * @returns {Promise<Array>} List of blobs
 */
export async function listBlobFiles(prefix = '') {
  try {
    if (!BLOB_ENABLED) {
      throw new Error('Vercel Blob storage not configured.');
    }

    const { blobs } = await list({ prefix });
    return blobs;
  } catch (error) {
    logError(error, { context: 'vercel-blob-list', prefix });
    throw new Error('Failed to list Vercel Blob files: ' + error.message);
  }
}

/**
 * Check if Vercel Blob is enabled
 * @returns {boolean}
 */
export function isBlobEnabled() {
  return BLOB_ENABLED;
}

export default {
  uploadToBlob,
  deleteFromBlob,
  listBlobFiles,
  isBlobEnabled,
};
