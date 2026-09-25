import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function safeJsonParse(val, fallback) {
  if (typeof val === 'object' && val !== null) return val;
  if (!val || typeof val !== 'string') return fallback;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

export async function GET() {
  try {
    const [user, settings, projects, skills, experiences, certificates] = await Promise.all([
      prisma.user.findFirst({
        select: {
          id: true,
          name: true,
          title: true,
          bio: true,
          about: true,
          avatarUrl: true,
          resumeUrl: true,
          socials: true,
        },
      }),
      prisma.siteSetting.findFirst(),
      prisma.project.findMany({
        orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.skill.findMany({
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      }),
      prisma.experience.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.certificate.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
    ]);

    const parsedUser = user
      ? {
          ...user,
          socials: safeJsonParse(user.socials, {}),
        }
      : null;

    const parsedProjects = (projects || []).map((p) => ({
      ...p,
      techStack: safeJsonParse(p.techStack, []),
    }));

    return NextResponse.json({
      user: parsedUser,
      settings: settings || {
        availableForHire: true,
        statusBadgeText: 'Available for new projects',
        statsExperience: '3+ Years',
        statsProjects: '20+ Built',
        statsClients: '12+ Happy',
      },
      projects: parsedProjects,
      skills: skills || [],
      experiences: experiences || [],
      certificates: certificates || [],
    });
  } catch (error) {
    console.error('Portfolio Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio data: ' + error.message }, { status: 500 });
  }
}
