import { NextResponse } from 'next/server';
import { uploadImage, validateImage, isCloudinaryEnabled } from '@/lib/cloudinary';
import { withErrorHandling, ValidationError, ApiError } from '@/lib/errorHandler';
import { rateLimitMiddleware } from '@/lib/rateLimit';
import { logInfo } from '@/lib/logger';

/**
 * POST /api/upload
 * Upload file to Cloudinary or local storage
 * Supports rate limiting, validation, and error handling
 */
async function handler(request) {
  const formData = await request.formData();
  const file = formData.get('file');
  const type = formData.get('type') || 'books';

  if (!file) {
    throw new ValidationError('No file uploaded');
  }

  const maxSize = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10);
  const validation = validateImage(
    {
      type: file.type,
      size: file.size,
    },
    maxSize
  );

  if (!validation.valid) {
    throw new ValidationError(validation.error);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `${Date.now()}-${originalName}`;

  try {
    const result = await uploadImage(buffer, filename, type);

    logInfo('File uploaded successfully', {
      filename,
      type,
      size: file.size,
      cloudinary: isCloudinaryEnabled(),
    });

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      url: result.url,
      publicId: result.publicId,
      format: result.format,
      cloudinary: isCloudinaryEnabled(),
    });
  } catch (error) {
    throw new ApiError('Failed to upload file', 500, error.message);
  }
}

export async function POST(request) {
  return rateLimitMiddleware(withErrorHandling(handler))(request, {
    json: (data) => NextResponse.json(data, { status: data.success ? 200 : data.statusCode || 500 }),
    status: (code) => ({
      json: (data) => NextResponse.json(data, { status: code }),
    }),
    setHeader: () => {},
  });
}
