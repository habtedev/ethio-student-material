import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, getBotStats, deleteTelegramUser } from '@/src/lib/db/user.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [users, stats] = await Promise.all([
      getAllUsers(100),
      getBotStats(),
    ]);

    return NextResponse.json({
      ok: true,
      stats,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('❌ Failed to fetch users API:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get('telegramId');
    let telegramId = idParam ? Number(idParam) : null;

    if (!telegramId) {
      const body = await req.json().catch(() => ({}));
      telegramId = body.telegramId ? Number(body.telegramId) : null;
    }

    if (!telegramId) {
      return NextResponse.json({ ok: false, error: 'telegramId is required' }, { status: 400 });
    }

    const success = await deleteTelegramUser(telegramId);
    return NextResponse.json({
      ok: true,
      success,
      message: `User ${telegramId} deleted successfully.`,
    });
  } catch (error) {
    console.error('❌ Failed to delete user API:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
