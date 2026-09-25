import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const {
      name,
      title,
      bio,
      about,
      avatarUrl,
      resumeUrl,
      socials,
      newPassword,
      availableForHire,
      statusBadgeText,
      statsExperience,
      statsProjects,
      statsClients,
    } = data;

    // Find the user record resiliently
    let targetUser = null;
    if (session.userId) {
      targetUser = await prisma.user.findUnique({ where: { id: session.userId } });
    }
    if (!targetUser && session.username) {
      targetUser = await prisma.user.findUnique({ where: { username: session.username } });
    }
    if (!targetUser) {
      targetUser = await prisma.user.findFirst();
    }

    if (!targetUser) {
      return NextResponse.json({ error: 'User admin tidak ditemukan' }, { status: 404 });
    }

    const updateData = {
      name: name || targetUser.name,
      title: title || targetUser.title,
      bio: bio !== undefined ? bio : targetUser.bio,
      about: about !== undefined ? about : targetUser.about,
      avatarUrl: avatarUrl !== undefined ? avatarUrl : targetUser.avatarUrl,
      resumeUrl: resumeUrl !== undefined ? resumeUrl : targetUser.resumeUrl,
      socials: typeof socials === 'object' ? JSON.stringify(socials) : (socials || targetUser.socials),
    };

    if (newPassword && newPassword.trim().length >= 6) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: updateData,
    });

    // Update or create site settings
    const updatedSettings = await prisma.siteSetting.upsert({
      where: { id: 'site-config' },
      update: {
        availableForHire: Boolean(availableForHire),
        statusBadgeText: statusBadgeText || 'Available for new projects',
        statsExperience: statsExperience || '3+ Years',
        statsProjects: statsProjects || '20+ Built',
        statsClients: statsClients || '12+ Happy',
      },
      create: {
        id: 'site-config',
        availableForHire: Boolean(availableForHire),
        statusBadgeText: statusBadgeText || 'Available for new projects',
        statsExperience: statsExperience || '3+ Years',
        statsProjects: statsProjects || '20+ Built',
        statsClients: statsClients || '12+ Happy',
      },
    });

    let parsedSocials = {};
    try {
      parsedSocials = typeof updatedUser.socials === 'string' ? JSON.parse(updatedUser.socials) : updatedUser.socials;
    } catch (e) {
      parsedSocials = {};
    }

    return NextResponse.json({
      success: true,
      message: 'Profil dan pengaturan berhasil diperbarui',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        title: updatedUser.title,
        bio: updatedUser.bio,
        about: updatedUser.about,
        avatarUrl: updatedUser.avatarUrl,
        resumeUrl: updatedUser.resumeUrl,
        socials: parsedSocials,
      },
      settings: updatedSettings,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui profil: ' + error.message }, { status: 500 });
  }
}
