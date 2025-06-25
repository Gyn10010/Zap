
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// Simulador de mensagens WhatsApp para demonstração
export async function POST(request: NextRequest) {
  try {
    const { action, contactName, phone, content, messageType } = await request.json();

    if (action === 'create_contact') {
      // Criar contato de demonstração
      const contact = await prisma.contact.upsert({
        where: { phone },
        update: { name: contactName },
        create: {
          name: contactName,
          phone,
        },
      });

      return NextResponse.json(contact);
    }

    if (action === 'send_message') {
      // Simular recebimento de mensagem
      const contact = await prisma.contact.findFirst({
        where: {
          phone,
        },
      });

      if (!contact) {
        return NextResponse.json(
          { error: 'Contato não encontrado' },
          { status: 404 }
        );
      }

      const message = await prisma.message.create({
        data: {
          content,
          type: messageType || 'TEXT',
          contactId: contact.id,
          isFromUser: false,
          timestamp: new Date(),
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

      // Aplicar classificação automática
      try {
        const classifyResponse = await fetch(`http://localhost:3000/api/messages/classify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messageId: message.id,
            content: content,
          }),
        });

        if (classifyResponse.ok) {
          const classifiedMessage = await classifyResponse.json();
          return NextResponse.json(classifiedMessage);
        }
      } catch (error) {
        console.error('Erro na classificação automática:', error);
      }

      return NextResponse.json(message);
    }

    return NextResponse.json(
      { error: 'Ação não reconhecida' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Erro no simulador:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Gerar mensagens de demonstração
export async function GET(request: NextRequest) {
  try {
    // Dados de demonstração
    const demoContacts = [
      { name: 'João Silva', phone: '+5511999888777' },
      { name: 'Maria Santos', phone: '+5511888777666' },
      { name: 'Pedro Costa', phone: '+5511777666555' },
      { name: 'Ana Lima', phone: '+5511666555444' },
      { name: 'Grupo Projeto ABC', phone: '+5511555444333', isGroup: true },
    ];

    const demoMessages = [
      'Olá! Gostaria de saber mais sobre seus produtos.',
      'Urgente: Preciso de suporte técnico agora!',
      'Qual o preço do produto X?',
      'Obrigado pelo atendimento excelente.',
      'Tenho uma dúvida sobre o orçamento enviado.',
      'Bom dia! Como funciona a garantia?',
      'Problema no sistema - não consigo fazer login.',
      'Quando será a próxima reunião?',
      'Parabéns pelo serviço! Muito satisfeito.',
      'Preciso cancelar meu pedido urgentemente.',
    ];

    // Criar contatos de demonstração
    for (const contactData of demoContacts) {
      await prisma.contact.upsert({
        where: { phone: contactData.phone },
        update: { name: contactData.name },
        create: {
          ...contactData,
        },
      });
    }

    // Criar mensagens de demonstração
    const contacts = await prisma.contact.findMany();

    for (let i = 0; i < 15; i++) {
      const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
      const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
      const randomDate = new Date();
      randomDate.setMinutes(randomDate.getMinutes() - Math.floor(Math.random() * 2880)); // últimas 48 horas

      await prisma.message.create({
        data: {
          content: randomMessage,
          contactId: randomContact.id,
          isFromUser: Math.random() > 0.7, // 30% chance de ser do usuário
          timestamp: randomDate,
          status: Math.random() > 0.5 ? 'PENDING' : (Math.random() > 0.5 ? 'READ' : 'RESPONDED'),
        },
      });
    }

    return NextResponse.json({
      message: 'Dados de demonstração criados com sucesso',
      contacts: contacts.length,
      messages: 15,
    });
  } catch (error) {
    console.error('Erro ao criar dados de demonstração:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
