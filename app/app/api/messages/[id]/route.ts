
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, priority, category, isRead, respondedAt } = await request.json();

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (category !== undefined) updateData.category = category;
    if (isRead !== undefined) updateData.isRead = isRead;
    if (respondedAt !== undefined) updateData.respondedAt = respondedAt;

    const message = await prisma.message.update({
      where: {
        id: params.id,
      },
      data: updateData,
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
    console.error('Erro ao atualizar mensagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.message.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Mensagem deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar mensagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
