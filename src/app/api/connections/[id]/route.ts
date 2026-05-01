import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status } = body;

    const connection = await prisma.connection.findUnique({
      where: { id },
    });

    if (!connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      );
    }

    if (connection.toId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this connection' },
        { status: 403 }
      );
    }

    const updated = await prisma.connection.update({
      where: { id },
      data: { status },
      include: {
        from: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } },
        to: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } },
      },
    });

    if (status === 'ACCEPTED') {
      await prisma.notification.create({
        data: {
          userId: connection.fromId,
          type: 'connection',
          title: 'Connection Accepted',
          content: `${session.user.firstName} ${session.user.lastName} accepted your connection request`,
          actorId: session.user.id,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update connection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const connection = await prisma.connection.findUnique({
      where: { id },
    });

    if (!connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      );
    }

    if (connection.toId !== session.user.id && connection.fromId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this connection' },
        { status: 403 }
      );
    }

    await prisma.connection.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete connection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
