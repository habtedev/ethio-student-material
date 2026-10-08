import { NextRequest, NextResponse } from 'next/server';
import { setPremiumStatus } from '@/src/lib/db/user.service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { telegramId, isPremium, days } = body;

    if (!telegramId) {
      return NextResponse.json({ error: 'telegramId is required' }, { status: 400 });
    }

    const updatedUser = await setPremiumStatus(
      Number(telegramId),
      Boolean(isPremium),
      days ? Number(days) : 30
    );

    return NextResponse.json({
      ok: true,
      user: updatedUser,
      message: `User premium status updated to ${isPremium ? 'TRUE' : 'FALSE'}`,
    });
  } catch (error) {
    console.error('❌ Failed to update premium status:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update premium status' },
      { status: 500 }
    );
  }
}
