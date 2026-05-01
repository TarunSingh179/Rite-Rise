import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const query = searchParams.get('q');

    if (query) {
      const skills = await prisma.skill.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
        take: 10,
      });
      return NextResponse.json({ skills });
    }

    if (userId) {
      const userSkills = await prisma.userSkill.findMany({
        where: { userId },
        include: {
          skill: true,
          user: true,
        },
        orderBy: { endorsed: 'desc' },
      });
      return NextResponse.json({ skills: userSkills });
    }

    const skills = await prisma.skill.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { name: 'asc' },
      take: 50,
    });

    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Get skills error:', error);
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
    const { skillId, userId } = body;

    const targetUserId = userId || session.user.id;

    const existing = await prisma.userSkill.findUnique({
      where: { userId_skillId: { userId: targetUserId, skillId } },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Skill already added' },
        { status: 409 }
      );
    }

    const userSkill = await prisma.userSkill.create({
      data: {
        userId: targetUserId,
        skillId,
      },
      include: { skill: true },
    });

    return NextResponse.json(userSkill, { status: 201 });
  } catch (error) {
    console.error('Add skill error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userSkillId } = body;

    const endorsement = await prisma.endorsement.create({
      data: {
        skillId: body.skillId,
        endorserId: session.user.id,
      },
    });

    await prisma.userSkill.update({
      where: { id: userSkillId },
      data: { endorsed: { increment: 1 } },
    });

    return NextResponse.json(endorsement, { status: 201 });
  } catch (error) {
    console.error('Endorse skill error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
