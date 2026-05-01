import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { repoSchema } from '@/lib/validations';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = { visibility: 'PUBLIC' };
    if (userId) where.ownerId = userId;

    const [repos, total] = await Promise.all([
      prisma.repo.findMany({
        where,
        include: {
          owner: {
            select: { id: true, username: true, firstName: true, lastName: true, avatar: true },
          },
          collaborators: {
            include: { user: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } } },
          },
          _count: { select: { issues: true, releases: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.repo.count({ where }),
    ]);

    return NextResponse.json({
      repos,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get repos error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = repoSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, description, url, language, topics, visibility } = validation.data;

    const repo = await prisma.repo.create({
      data: {
        ownerId: session.user.id,
        name,
        description,
        url,
        language,
        topics,
        visibility,
      },
      include: {
        owner: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } },
      },
    });

    return NextResponse.json(repo, { status: 201 });
  } catch (error) {
    console.error('Create repo error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
