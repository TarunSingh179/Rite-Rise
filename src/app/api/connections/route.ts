import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { connectionSchema } from '@/lib/validations';
import { ConnectionStatus } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = (searchParams.get('status') as ConnectionStatus) || 'ACCEPTED';

    const connections = await prisma.connection.findMany({
      where: {
        OR: [
          { fromId: session.user.id, status },
          { toId: session.user.id, status },
        ],
      },
      include: {
        from: {
          select: { id: true, username: true, firstName: true, lastName: true, avatar: true, role: true },
        },
        to: {
          select: { id: true, username: true, firstName: true, lastName: true, avatar: true, role: true },
        },
      },
    });

    return NextResponse.json({ connections });
  } catch (error) {
    console.error('Get connections error:', error);
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
    const validation = connectionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { userId } = validation.data;

    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot connect with yourself' },
        { status: 400 }
      );
    }

    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          { fromId: session.user.id, toId: userId },
          { fromId: userId, toId: session.user.id },
        ],
      },
    });

    if (existingConnection) {
      return NextResponse.json(
        { error: 'Connection already exists' },
        { status: 409 }
      );
    }

    const connection = await prisma.connection.create({
      data: {
        fromId: session.user.id,
        toId: userId,
        status: 'PENDING',
      },
      include: {
        from: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } },
        to: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } },
      },
    });

    await prisma.notification.create({
      data: {
        userId,
        type: 'connection',
        title: 'New Connection Request',
        content: `${session.user.firstName} ${session.user.lastName} wants to connect with you`,
        actorId: session.user.id,
      },
    });

    return NextResponse.json(connection, { status: 201 });
  } catch (error) {
    console.error('Create connection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
