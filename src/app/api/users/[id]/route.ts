import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params;
  try {
    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        department: true,
        year: true,
        graduationYear: true,
        location: true,
        website: true,
        githubUrl: true,
        linkedinUrl: true,
        role: true,
        verified: true,
        createdAt: true,
        profile: true,
        _count: {
          select: {
            posts: true,
            connectionsFrom: true,
            connectionsTo: true,
            repos: true,
            events: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const connectionsCount = user._count.connectionsFrom + user._count.connectionsTo;

    const [connections, posts, repos, skills] = await Promise.all([
      prisma.connection.findMany({
        where: {
          OR: [{ fromId: userId, status: 'ACCEPTED' }, { toId: userId, status: 'ACCEPTED' }],
        },
        include: {
          from: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true, role: true } },
          to: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true, role: true } },
        },
        take: 6,
      }),
      prisma.post.findMany({
        where: { authorId: userId, visibility: 'PUBLIC' },
        include: {
          author: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } },
          _count: { select: { comments: true, reactions: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.repo.findMany({
        where: { ownerId: userId, visibility: 'PUBLIC' },
        include: { _count: { select: { collaborators: true } } },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
      prisma.userSkill.findMany({
        where: { userId },
        include: { skill: true },
        orderBy: { endorsed: 'desc' },
        take: 10,
      }),
    ]);

    const isOwnProfile = session?.user?.id === userId;

    let connectionStatus = 'none';
    if (!isOwnProfile && session?.user?.id) {
      const existingConnection = await prisma.connection.findFirst({
        where: {
          OR: [
            { fromId: session.user.id, toId: userId },
            { fromId: userId, toId: session.user.id },
          ],
        },
      });
      if (existingConnection) {
        connectionStatus = existingConnection.status;
      }
    }

    return NextResponse.json({
      user: { ...user, connectionStatus },
      connections,
      posts,
      repos,
      skills,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.id !== id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bio, department, year, graduationYear, location, website, githubUrl, linkedinUrl, resumeUrl } = body;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio,
        department,
        year,
        graduationYear,
        location,
        website,
        githubUrl,
        linkedinUrl,
        resumeUrl,
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        department: true,
        year: true,
        graduationYear: true,
        location: true,
        website: true,
        githubUrl: true,
        linkedinUrl: true,
        resumeUrl: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
