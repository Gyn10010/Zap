
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (priority && priority !== 'all') {
      where.priority = priority;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { content: { contains: search, mode: 'insensitive' } },
        { contact: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        contact: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, contactId, isFromUser } = await request.json();

    if (!content || !contactId) {
      return NextResponse.json(
        { error: 'Conteúdo e contato são obrigatórios' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        contactId,
        isFromUser: isFromUser || false,
      },
      include: {
        contact: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
