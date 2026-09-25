import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { type, role, institution, period, description, order } = await request.json();
    if (!role || !institution || !period) {
      return NextResponse.json({ error: 'Posisi/Gelar, Institusi, dan Periode wajib diisi' }, { status: 400 });
    }

    const experience = await prisma.experience.create({
      data: {
        type: type || 'WORK',
        role,
        institution,
        period,
        description: description || '',
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, experience });
  } catch (error) {
    console.error('Create Experience Error:', error);
    return NextResponse.json({ error: 'Gagal menambahkan data pengalaman' }, { status: 500 });
  }
}

export async function PUT(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, type, role, institution, period, description, order } = await request.json();
    if (!id || !role || !institution || !period) {
      return NextResponse.json({ error: 'ID, Posisi/Gelar, Institusi, dan Periode wajib diisi' }, { status: 400 });
    }

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        type: type || 'WORK',
        role,
        institution,
        period,
        description: description || '',
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, experience });
  } catch (error) {
    console.error('Update Experience Error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui data pengalaman' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID data wajib disertakan' }, { status: 400 });

    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Data pengalaman berhasil dihapus' });
  } catch (error) {
    console.error('Delete Experience Error:', error);
    return NextResponse.json({ error: 'Gagal menghapus data pengalaman' }, { status: 500 });
  }
}
