import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .concat('-', Math.floor(Math.random() * 1000));
}

// POST - Create Project
export async function POST(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const { title, category, description, coverImage, demoUrl, githubUrl, techStack, featured, order } = data;

    if (!title || !description || !coverImage) {
      return NextResponse.json({ error: 'Judul, deskripsi, dan cover image wajib diisi' }, { status: 400 });
    }

    const slug = generateSlug(title);

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        category: category || 'Fullstack',
        description,
        coverImage,
        demoUrl: demoUrl || '',
        githubUrl: githubUrl || '',
        techStack: typeof techStack === 'object' ? JSON.stringify(techStack) : JSON.stringify([techStack]),
        featured: Boolean(featured),
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Create Project Error:', error);
    return NextResponse.json({ error: 'Gagal membuat proyek' }, { status: 500 });
  }
}

// PUT - Update Project
export async function PUT(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const { id, title, category, description, coverImage, demoUrl, githubUrl, techStack, featured, order } = data;

    if (!id || !title || !description || !coverImage) {
      return NextResponse.json({ error: 'ID, judul, deskripsi, dan cover image wajib diisi' }, { status: 400 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        category: category || 'Fullstack',
        description,
        coverImage,
        demoUrl: demoUrl || '',
        githubUrl: githubUrl || '',
        techStack: typeof techStack === 'object' ? JSON.stringify(techStack) : (typeof techStack === 'string' && techStack.startsWith('[') ? techStack : JSON.stringify([techStack])),
        featured: Boolean(featured),
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Update Project Error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui proyek' }, { status: 500 });
  }
}

// DELETE - Delete Project
export async function DELETE(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID proyek wajib disertakan' }, { status: 400 });

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Proyek berhasil dihapus' });
  } catch (error) {
    console.error('Delete Project Error:', error);
    return NextResponse.json({ error: 'Gagal menghapus proyek' }, { status: 500 });
  }
}
