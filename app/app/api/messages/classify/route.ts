
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { messageId, content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Conteúdo da mensagem é obrigatório' },
        { status: 400 }
      );
    }

    // Fazer requisição para a API LLM para classificar a mensagem
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em classificar mensagens de WhatsApp para profissionais. 
            Analise a mensagem e classifique em:

            PRIORIDADE: LOW, NORMAL, HIGH, URGENT
            CATEGORIA: PERSONAL, PROFESSIONAL, SALES, SUPPORT, MARKETING, OTHER
            STATUS: PENDING (sempre para mensagens novas)

            Critérios para PRIORIDADE:
            - URGENT: palavras como "urgente", "emergência", "agora", "rápido", "socorro"
            - HIGH: palavras como "importante", "prioridade", "preciso", "deadline"
            - NORMAL: maioria das mensagens profissionais
            - LOW: cumprimentos simples, agradecimentos

            Critérios para CATEGORIA:
            - SALES: palavras como "comprar", "preço", "valor", "orçamento", "produto"
            - SUPPORT: palavras como "problema", "erro", "ajuda", "dúvida", "não funciona"
            - MARKETING: palavras como "promoção", "desconto", "oferta", "campanha"
            - PERSONAL: cumprimentos pessoais, família, amigos
            - PROFESSIONAL: reuniões, projetos, trabalho
            - OTHER: não se encaixa nas outras

            Responda APENAS no formato JSON:
            {"priority": "PRIORITY_VALUE", "category": "CATEGORY_VALUE", "tags": ["tag1", "tag2"]}

            Inclua também sugestões de tags relevantes baseadas no conteúdo.`
          },
          {
            role: 'user',
            content: `Classifique esta mensagem: "${content}"`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error('Erro na API de classificação');
    }

    const result = await response.json();
    let classification;

    try {
      // Sanitizar o JSON response
      let cleanedContent = result.choices[0].message.content;
      cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      cleanedContent = cleanedContent.replace(/,$(?=\s*})/gm, ''); // Remove trailing commas
      classification = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Erro ao fazer parse da resposta da IA:', parseError);
      // Fallback para classificação padrão
      classification = {
        priority: 'NORMAL',
        category: 'PROFESSIONAL',
        tags: []
      };
    }

    // Se messageId foi fornecido, atualizar a mensagem existente
    if (messageId) {
      const updatedMessage = await prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          priority: classification.priority,
          category: classification.category,
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

      // Aplicar tags automáticas se existirem
      if (classification.tags && classification.tags.length > 0) {
        // Buscar tags automáticas
        const existingTags = await prisma.tag.findMany({
          where: {
            isAutomatic: true,
          },
        });

        // Aplicar tags baseadas nas palavras-chave
        for (const tag of existingTags) {
          const hasKeyword = tag.keywords.some(keyword => 
            content.toLowerCase().includes(keyword.toLowerCase())
          );
          
          if (hasKeyword) {
            await prisma.messageTag.upsert({
              where: {
                messageId_tagId: {
                  messageId: messageId,
                  tagId: tag.id,
                },
              },
              create: {
                messageId: messageId,
                tagId: tag.id,
              },
              update: {},
            });
          }
        }
      }

      return NextResponse.json(updatedMessage);
    }

    // Caso contrário, retornar apenas a classificação
    return NextResponse.json(classification);
  } catch (error) {
    console.error('Erro ao classificar mensagem:', error);
    return NextResponse.json(
      { error: 'Erro ao classificar mensagem' },
      { status: 500 }
    );
  }
}
