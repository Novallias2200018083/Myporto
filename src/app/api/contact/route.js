import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Nama, email, dan pesan wajib diisi' }, { status: 400 });
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || 'Pesan dari Portofolio',
        message,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pesan Anda berhasil dikirim! Terima kasih.',
      data: newMessage,
    });
  } catch (error) {
    console.error('Contact Form Error:', error);
    return NextResponse.json({ error: 'Gagal mengirim pesan. Silakan coba lagi.' }, { status: 500 });
  }
}
