import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET - List all messages
export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Fetch Messages Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil pesan' }, { status: 500 });
  }
}

// PATCH - Toggle read status
export async function PATCH(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, isRead } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID pesan wajib disertakan' }, { status: 400 });

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: Boolean(isRead) },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Update Message Error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui status pesan' }, { status: 500 });
  }
}

// DELETE - Delete message
export async function DELETE(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID pesan wajib disertakan' }, { status: 400 });

    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Pesan berhasil dihapus' });
  } catch (error) {
    console.error('Delete Message Error:', error);
    return NextResponse.json({ error: 'Gagal menghapus pesan' }, { status: 500 });
  }
}
