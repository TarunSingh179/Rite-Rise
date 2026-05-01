import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q');

    let whereClause = {};
    if (search) {
      whereClause = {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    const organizations = await prisma.organization.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { members: true, departments: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(organizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Usually, only ADMIN or MANAGEMENT can create organizations.
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGEMENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, type, website, location } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        description,
        type: type || 'UNIVERSITY',
        website,
        location,
      },
    });

    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
