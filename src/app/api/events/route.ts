import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { eventSchema } from '@/lib/validations';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');
    const upcoming = searchParams.get('upcoming') === 'true';

    const where: any = {};
    if (type) where.type = type;
    if (upcoming) where.startTime = { gte: new Date() };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          organizer: {
            select: { id: true, username: true, firstName: true, lastName: true, avatar: true, role: true },
          },
          attendees: {
            include: { user: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } } },
          },
        },
        orderBy: { startTime: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({
      events,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get events error:', error);
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
    const validation = eventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { title, description, location, startTime, endTime, type, capacity, tags } = validation.data;

    const event = await prisma.event.create({
      data: {
        organizerId: session.user.id,
        title,
        description,
        location,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        type,
        capacity,
        tags,
      },
      include: {
        organizer: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true, role: true } },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
