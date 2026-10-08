import { NextRequest, NextResponse } from 'next/server';
import {
  getAllUniversities,
  createUniversity,
  deleteUniversity,
} from '@/src/lib/db/university.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;

    const universities = await getAllUniversities({ search });

    return NextResponse.json({
      success: true,
      count: universities.length,
      universities,
    });
  } catch (error) {
    console.error('❌ Failed to fetch universities:', error);
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
      code,
      name,
      city,
      rating,
      reviewDescription,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'University name is required' }, { status: 400 });
    }

    const newUni = await createUniversity({
      code: (code || 'UNI').toUpperCase().trim(),
      name: String(name).trim(),
      city: city ? String(city).trim() : 'Ethiopia',
      rating: Number(rating) || 4.8,
      reviewDescription: reviewDescription ? String(reviewDescription).trim() : '',
    });

    return NextResponse.json({
      success: true,
      university: newUni,
    });
  } catch (error) {
    console.error('❌ Failed to create university:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save university' },
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
      return NextResponse.json({ error: 'University ID is required' }, { status: 400 });
    }

    const success = await deleteUniversity(id);
    return NextResponse.json({ success, id });
  } catch (error) {
    console.error('❌ Failed to delete university:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete university' },
      { status: 500 }
    );
  }
}
