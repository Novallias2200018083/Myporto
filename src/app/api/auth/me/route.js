import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  let user = null;
  if (session.userId) {
    user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        username: true,
        name: true,
        title: true,
        bio: true,
        about: true,
        avatarUrl: true,
        resumeUrl: true,
        socials: true,
      },
    });
  }

  if (!user && session.username) {
    user = await prisma.user.findUnique({
      where: { username: session.username },
      select: {
        id: true,
        username: true,
        name: true,
        title: true,
        bio: true,
        about: true,
        avatarUrl: true,
        resumeUrl: true,
        socials: true,
      },
    });
  }

  if (!user) {
    user = await prisma.user.findFirst({
      select: {
        id: true,
        username: true,
        name: true,
        title: true,
        bio: true,
        about: true,
        avatarUrl: true,
        resumeUrl: true,
        socials: true,
      },
    });
  }

  return NextResponse.json({
    authenticated: true,
    user,
  });
}
