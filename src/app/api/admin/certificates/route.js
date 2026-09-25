import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, issuer, issueDate, credentialUrl, imageUrl, order } = await request.json();
    if (!title || !issuer || !issueDate) {
      return NextResponse.json({ error: 'Judul, penerbit, dan tanggal wajib diisi' }, { status: 400 });
    }

    const cert = await prisma.certificate.create({
      data: {
        title,
        issuer,
        issueDate,
        credentialUrl: credentialUrl || '',
        imageUrl: imageUrl || '',
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, certificate: cert });
  } catch (error) {
    console.error('Create Certificate Error:', error);
    return NextResponse.json({ error: 'Gagal menambahkan sertifikat' }, { status: 500 });
  }
}

export async function PUT(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, title, issuer, issueDate, credentialUrl, imageUrl, order } = await request.json();
    if (!id || !title || !issuer || !issueDate) {
      return NextResponse.json({ error: 'ID, judul, penerbit, dan tanggal wajib diisi' }, { status: 400 });
    }

    const cert = await prisma.certificate.update({
      where: { id },
      data: {
        title,
        issuer,
        issueDate,
        credentialUrl: credentialUrl || '',
        imageUrl: imageUrl || '',
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, certificate: cert });
  } catch (error) {
    console.error('Update Certificate Error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui sertifikat' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID sertifikat wajib disertakan' }, { status: 400 });

    await prisma.certificate.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Sertifikat berhasil dihapus' });
  } catch (error) {
    console.error('Delete Certificate Error:', error);
    return NextResponse.json({ error: 'Gagal menghapus sertifikat' }, { status: 500 });
  }
}
