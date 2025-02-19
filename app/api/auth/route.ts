import { authOptions } from '@/utils/authoptions';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function GET(_request: Request) {
    const session = await getServerSession(authOptions);
    return NextResponse.json({ authenticated: !!session });
};