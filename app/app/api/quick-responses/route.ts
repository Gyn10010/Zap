
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const quickResponses = await prisma.quickResponse.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        usageCount: 'desc',
      },
    });

    return NextResponse.json(quickResponses);
  } catch (error) {
    console.error('Erro ao buscar respostas rápidas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, category, keywords } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título e conteúdo são obrigatórios' },
        { status: 400 }
      );
    }

    const quickResponse = await prisma.quickResponse.create({
      data: {
        title,
        content,
        category,
        keywords: keywords || [],
      },
    });

    return NextResponse.json(quickResponse);
  } catch (error) {
    console.error('Erro ao criar resposta rápida:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
