import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';

    if (!query) {
      return NextResponse.json({ users: [], posts: [], repos: [], events: [] });
    }

    const results: any = {};

    if (type === 'all' || type === 'users') {
      results.users = await prisma.user.findMany({
        where: {
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { username: { contains: query, mode: 'insensitive' } },
            { department: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          role: true,
          department: true,
        },
        take: 10,
      });
    }

    if (type === 'all' || type === 'posts') {
      results.posts = await prisma.post.findMany({
        where: {
          OR: [
            { content: { contains: query, mode: 'insensitive' } },
            { title: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } },
          ],
          visibility: 'PUBLIC',
        },
        include: {
          author: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } },
        },
        take: 10,
      });
    }

    if (type === 'all' || type === 'repos') {
      results.repos = await prisma.repo.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { topics: { has: query } },
          ],
          visibility: 'PUBLIC',
        },
        include: {
          owner: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } },
        },
        take: 10,
      });
    }

    if (type === 'all' || type === 'events') {
      results.events = await prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } },
          ],
        },
        include: {
          organizer: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } },
        },
        take: 10,
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
