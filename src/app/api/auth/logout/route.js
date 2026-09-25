import { NextResponse } from 'next/server';
import { clearSessionCookie, getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  clearSessionCookie();
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
