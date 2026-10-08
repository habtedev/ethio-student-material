import { NextRequest, NextResponse } from 'next/server';
import {
  getAllDepartments,
  createDepartment,
  deleteDepartment,
} from '@/src/lib/db/department.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stream = searchParams.get('stream') || undefined;
    const search = searchParams.get('search') || undefined;

    const departments = await getAllDepartments({ stream, search });

    return NextResponse.json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    console.error('❌ Failed to fetch departments:', error);
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
      stream,
      description,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Department title is required' }, { status: 400 });
    }

    const newDept = await createDepartment({
      title: String(title).trim(),
      stream: (stream === 'Social' || stream === 'Both' || stream === 'Natural') ? stream : 'Natural',
      description: description ? String(description).trim() : '',
    });

    return NextResponse.json({
      success: true,
      department: newDept,
    });
  } catch (error) {
    console.error('❌ Failed to create department:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save department' },
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
      return NextResponse.json({ error: 'Department ID is required' }, { status: 400 });
    }

    const success = await deleteDepartment(id);
    return NextResponse.json({ success, id });
  } catch (error) {
    console.error('❌ Failed to delete department:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete department' },
      { status: 500 }
    );
  }
}
