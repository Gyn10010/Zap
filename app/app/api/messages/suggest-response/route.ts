
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { content, contactName, messageHistory } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Conteúdo da mensagem é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar respostas rápidas
    const quickResponses = await prisma.quickResponse.findMany({
      where: {
        isActive: true,
      },
    });

    // Primeiro, verificar se há uma resposta rápida que se encaixa
    const matchingQuickResponse = quickResponses.find(response => 
      response.keywords.some(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    let suggestions = [];

    if (matchingQuickResponse) {
      suggestions.push({
        type: 'quick_response',
        content: matchingQuickResponse.content,
        title: matchingQuickResponse.title,
        confidence: 0.9,
      });
    }

    // Fazer requisição para a API LLM para sugerir resposta personalizada
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
            content: `Você é um assistente especializado em sugerir respostas profissionais para mensagens de WhatsApp.
            
            Contexto:
            - Esta é uma conversa de WhatsApp de um profissional
            - O contato se chama: ${contactName || 'Cliente'}
            - Mantenha um tom profissional, mas amigável
            - Seja conciso e direto
            - Use saudações adequadas ao horário se necessário
            
            Baseado na mensagem recebida, sugira 2-3 respostas diferentes:
            1. Uma resposta direta e objetiva
            2. Uma resposta mais elaborada com detalhes
            3. Uma resposta para agendar um contato posterior (se aplicável)
            
            Responda APENAS no formato JSON:
            {
              "suggestions": [
                {
                  "type": "direct",
                  "content": "resposta direta",
                  "title": "Resposta Direta"
                },
                {
                  "type": "detailed", 
                  "content": "resposta detalhada",
                  "title": "Resposta Detalhada"
                },
                {
                  "type": "schedule",
                  "content": "resposta para agendar",
                  "title": "Agendar Contato"
                }
              ]
            }`
          },
          {
            role: 'user',
            content: `Mensagem recebida: "${content}"`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (response.ok) {
      const result = await response.json();
      try {
        // Sanitizar o JSON response
        let cleanedContent = result.choices[0].message.content;
        cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        cleanedContent = cleanedContent.replace(/,$(?=\s*})/gm, ''); // Remove trailing commas
        const aiSuggestions = JSON.parse(cleanedContent);
        
        if (aiSuggestions.suggestions) {
          suggestions.push(...aiSuggestions.suggestions.map((s: any) => ({
            ...s,
            confidence: 0.8,
          })));
        }
      } catch (parseError) {
        console.error('Erro ao fazer parse da resposta da IA:', parseError);
      }
    }

    // Se não há sugestões, fornecer respostas padrão
    if (suggestions.length === 0) {
      suggestions = [
        {
          type: 'default',
          content: 'Obrigado pela sua mensagem. Vou analisar e retorno em breve.',
          title: 'Resposta Padrão',
          confidence: 0.6,
        },
        {
          type: 'default',
          content: 'Olá! Recebi sua mensagem. Como posso ajudá-lo?',
          title: 'Saudação',
          confidence: 0.6,
        },
      ];
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Erro ao sugerir resposta:', error);
    return NextResponse.json(
      { error: 'Erro ao sugerir resposta' },
      { status: 500 }
    );
  }
}
