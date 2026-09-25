import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, category, iconName, level, order } = await request.json();
    if (!name || !category) {
      return NextResponse.json({ error: 'Nama dan kategori skill wajib diisi' }, { status: 400 });
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        iconName: iconName || 'Code2',
        level: Number(level) || 80,
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, skill });
  } catch (error) {
    console.error('Create Skill Error:', error);
    return NextResponse.json({ error: 'Gagal menambahkan skill' }, { status: 500 });
  }
}

export async function PUT(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, name, category, iconName, level, order } = await request.json();
    if (!id || !name || !category) {
      return NextResponse.json({ error: 'ID, nama, dan kategori skill wajib diisi' }, { status: 400 });
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        category,
        iconName: iconName || 'Code2',
        level: Number(level) || 80,
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, skill });
  } catch (error) {
    console.error('Update Skill Error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui skill' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID skill wajib disertakan' }, { status: 400 });

    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Skill berhasil dihapus' });
  } catch (error) {
    console.error('Delete Skill Error:', error);
    return NextResponse.json({ error: 'Gagal menghapus skill' }, { status: 500 });
  }
}
