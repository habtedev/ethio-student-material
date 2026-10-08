import { NextRequest, NextResponse } from 'next/server';
import {
  getAllMaterials,
  createMaterial,
  deleteMaterial,
} from '@/src/lib/db/material.service';
import { MaterialCategory, MaterialStream } from '@/src/types/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const stream = searchParams.get('stream') || undefined;
    const search = searchParams.get('search') || undefined;

    const materials = await getAllMaterials({ category, stream, search });

    return NextResponse.json({
      success: true,
      count: materials.length,
      materials,
    });
  } catch (error) {
    console.error('❌ Failed to fetch materials:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      code,
      courseName,
      category,
      stream,
      university,
      semester,
      credits,
      fileUrl,
      fileSize,
      fileFormat,
      description,
      cloudinaryId,
    } = body;

    if (!title || !fileUrl) {
      return NextResponse.json(
        { error: 'Title and File URL are required' },
        { status: 400 }
      );
    }

    const newMaterial = await createMaterial({
      title: String(title).trim(),
      code: (code || 'GEN101').toUpperCase().trim(),
      courseName: courseName || title,
      category: (category as MaterialCategory) || 'module',
      stream: (stream as MaterialStream) || 'Natural',
      university: university || 'Ministry of Education',
      semester: semester || 'Semester 1',
      credits: Number(credits) || 3,
      fileUrl: String(fileUrl).trim(),
      fileSize: fileSize || '5.0 MB',
      fileFormat: fileFormat || 'pdf',
      description: description || '',
      cloudinaryId: cloudinaryId || undefined,
    });

    return NextResponse.json({
      success: true,
      material: newMaterial,
    });
  } catch (error) {
    console.error('❌ Failed to create material:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save material' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: 'Material ID is required' }, { status: 400 });
    }

    const success = await deleteMaterial(id);
    return NextResponse.json({ success, id });
  } catch (error) {
    console.error('❌ Failed to delete material:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete material' },
      { status: 500 }
    );
  }
}
