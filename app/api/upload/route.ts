import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'ethio_student_materials';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    const originalFilename = file.name;
    const ext = originalFilename.split('.').pop()?.toLowerCase() || 'pdf';
    const sizeInBytes = file.size;
    const sizeFormatted =
      sizeInBytes > 1024 * 1024
        ? `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
        : `${(sizeInBytes / 1024).toFixed(0)} KB`;

    // 1. Try Cloudinary Upload if Cloudinary credentials exist
    if (cloudName && (uploadPreset || (apiKey && apiSecret))) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = `data:${file.type || 'application/octet-stream'};base64,${buffer.toString('base64')}`;

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
        const uploadBody: Record<string, string> = {
          file: base64Data,
          folder: folder,
        };

        if (uploadPreset) {
          uploadBody.upload_preset = uploadPreset;
        } else if (apiKey && apiSecret) {
          const timestamp = Math.round(new Date().getTime() / 1000).toString();
          uploadBody.timestamp = timestamp;
          uploadBody.api_key = apiKey;

          // Generate SHA-1 Signature
          const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
          const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');
          uploadBody.signature = signature;
        }

        const cloudRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadBody),
        });

        if (cloudRes.ok) {
          const cloudData = await cloudRes.json();
          return NextResponse.json({
            success: true,
            provider: 'cloudinary',
            url: cloudData.secure_url || cloudData.url,
            publicId: cloudData.public_id,
            format: cloudData.format || ext,
            size: sizeFormatted,
            fileName: originalFilename,
          });
        } else {
          const errText = await cloudRes.text();
          console.warn('⚠️ Cloudinary API error, falling back to local storage:', errText);
        }
      } catch (cloudErr) {
        console.warn('⚠️ Cloudinary upload request exception:', cloudErr);
      }
    }

    // 2. Local Storage Fallback (Always reliable in development / self-hosted environments)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const safeName = originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const diskFileName = `${uniqueId}_${safeName}`;
    const filePath = path.join(uploadsDir, diskFileName);

    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

    const publicUrl = `/uploads/${diskFileName}`;

    return NextResponse.json({
      success: true,
      provider: 'local',
      url: publicUrl,
      publicId: diskFileName,
      format: ext,
      size: sizeFormatted,
      fileName: originalFilename,
    });
  } catch (error) {
    console.error('❌ Upload endpoint error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'File upload failed' },
      { status: 500 }
    );
  }
}
