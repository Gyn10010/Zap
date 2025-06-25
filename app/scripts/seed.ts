
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar configurações padrão do sistema
  await prisma.userSettings.deleteMany(); // Limpar configurações existentes
  await prisma.userSettings.create({
    data: {
      alertTimeMinutes: 30,
      enablePushNotifications: true,
      enableEmailNotifications: false,
      workingHoursStart: "09:00",
      workingHoursEnd: "18:00",
      autoTagging: true,
      aiSuggestions: true,
      theme: "light",
      language: "pt",
    },
  });

  console.log('⚙️ Configurações padrão criadas');

  // Criar tags padrão
  const defaultTags = [
    { name: 'Vendas', color: '#10B981', isAutomatic: true, keywords: ['comprar', 'preço', 'valor', 'orçamento'] },
    { name: 'Suporte', color: '#F59E0B', isAutomatic: true, keywords: ['problema', 'erro', 'ajuda', 'não funciona'] },
    { name: 'Urgente', color: '#EF4444', isAutomatic: true, keywords: ['urgente', 'emergência', 'agora', 'rápido'] },
    { name: 'Marketing', color: '#8B5CF6', isAutomatic: true, keywords: ['promoção', 'desconto', 'oferta'] },
    { name: 'Pessoal', color: '#06B6D4', isAutomatic: false, keywords: [] },
    { name: 'Reunião', color: '#84CC16', isAutomatic: true, keywords: ['reunião', 'meeting', 'encontro'] },
  ];

  for (const tagData of defaultTags) {
    const existingTag = await prisma.tag.findFirst({
      where: { name: tagData.name },
    });

    if (!existingTag) {
      await prisma.tag.create({
        data: {
          name: tagData.name,
          color: tagData.color,
          isAutomatic: tagData.isAutomatic,
          keywords: tagData.keywords,
          description: `Tag automática para ${tagData.name.toLowerCase()}`,
        },
      });
    }
  }

  console.log('🏷️ Tags padrão criadas');

  // Criar respostas rápidas padrão
  const defaultQuickResponses = [
    {
      title: 'Saudação Inicial',
      content: 'Olá! Obrigado por entrar em contato. Como posso ajudá-lo hoje?',
      category: 'Saudações',
      keywords: ['oi', 'olá', 'bom dia', 'boa tarde', 'boa noite'],
    },
    {
      title: 'Aguardando Informações',
      content: 'Obrigado pela sua mensagem. Estou analisando sua solicitação e retorno em breve com mais informações.',
      category: 'Padrão',
      keywords: ['aguardar', 'analisar', 'verificar'],
    },
    {
      title: 'Informações sobre Preços',
      content: 'Ficamos felizes com seu interesse! Para fornecer um orçamento personalizado, preciso de algumas informações adicionais. Poderia me contar mais sobre suas necessidades?',
      category: 'Vendas',
      keywords: ['preço', 'valor', 'quanto custa', 'orçamento'],
    },
    {
      title: 'Suporte Técnico',
      content: 'Entendo sua preocupação. Para resolver seu problema da melhor forma, preciso entender melhor a situação. Pode me descrever o que está acontecendo?',
      category: 'Suporte',
      keywords: ['problema', 'erro', 'não funciona', 'ajuda'],
    },
    {
      title: 'Agendamento',
      content: 'Vamos agendar uma conversa! Que tal na próxima semana? Tenho disponibilidade na terça e quinta-feira pela manhã. Qual horário seria melhor para você?',
      category: 'Reuniões',
      keywords: ['agendar', 'reunião', 'conversar', 'meeting'],
    },
    {
      title: 'Despedida',
      content: 'Foi um prazer falar com você! Se precisar de mais alguma coisa, não hesite em entrar em contato. Tenha um ótimo dia! 😊',
      category: 'Despedidas',
      keywords: ['tchau', 'obrigado', 'até logo'],
    },
  ];

  for (const responseData of defaultQuickResponses) {
    const existingResponse = await prisma.quickResponse.findFirst({
      where: { title: responseData.title },
    });

    if (!existingResponse) {
      await prisma.quickResponse.create({
        data: {
          title: responseData.title,
          content: responseData.content,
          category: responseData.category,
          keywords: responseData.keywords,
        },
      });
    }
  }

  console.log('💬 Respostas rápidas padrão criadas');

  // Criar contatos de demonstração
  const demoContacts = [
    { name: 'João Silva', phone: '+5511999888777' },
    { name: 'Maria Santos', phone: '+5511888777666' },
    { name: 'Pedro Costa', phone: '+5511777666555' },
    { name: 'Ana Lima', phone: '+5511666555444' },
    { name: 'Carlos Ferreira', phone: '+5511555444333' },
    { name: 'Luciana Oliveira', phone: '+5511444333222' },
    { name: 'Roberto Mendes', phone: '+5511333222111' },
    { name: 'Fernanda Costa', phone: '+5511222111000' },
    { name: 'Grupo Projeto ABC', phone: '+5511111000999', isGroup: true, groupName: 'Projeto ABC' },
    { name: 'Equipe Vendas', phone: '+5511000999888', isGroup: true, groupName: 'Equipe Vendas SP' },
  ];

  for (const contactData of demoContacts) {
    await prisma.contact.upsert({
      where: { phone: contactData.phone },
      update: { name: contactData.name },
      create: {
        name: contactData.name,
        phone: contactData.phone,
        isGroup: contactData.isGroup || false,
        groupName: contactData.groupName,
      },
    });
  }

  console.log('👥 Contatos de demonstração criados');

  // Criar mensagens de demonstração
  const demoMessages = [
    { content: 'Olá! Gostaria de saber mais sobre seus produtos.', priority: 'NORMAL', category: 'SALES', status: 'PENDING' },
    { content: 'Urgente: Preciso de suporte técnico agora!', priority: 'URGENT', category: 'SUPPORT', status: 'PENDING' },
    { content: 'Qual o preço do produto X?', priority: 'HIGH', category: 'SALES', status: 'READ' },
    { content: 'Obrigado pelo atendimento excelente.', priority: 'LOW', category: 'PERSONAL', status: 'RESPONDED' },
    { content: 'Tenho uma dúvida sobre o orçamento enviado.', priority: 'NORMAL', category: 'SALES', status: 'PENDING' },
    { content: 'Bom dia! Como funciona a garantia?', priority: 'NORMAL', category: 'SUPPORT', status: 'READ' },
    { content: 'Problema no sistema - não consigo fazer login.', priority: 'HIGH', category: 'SUPPORT', status: 'PENDING' },
    { content: 'Quando será a próxima reunião?', priority: 'NORMAL', category: 'PROFESSIONAL', status: 'READ' },
    { content: 'Parabéns pelo serviço! Muito satisfeito.', priority: 'LOW', category: 'PERSONAL', status: 'RESPONDED' },
    { content: 'Preciso cancelar meu pedido urgentemente.', priority: 'URGENT', category: 'SALES', status: 'PENDING' },
  ];

  const contacts = await prisma.contact.findMany();

  for (let i = 0; i < demoMessages.length; i++) {
    const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
    const messageData = demoMessages[i];
    const randomDate = new Date();
    randomDate.setMinutes(randomDate.getMinutes() - Math.floor(Math.random() * 2880)); // últimas 48 horas

    await prisma.message.create({
      data: {
        content: messageData.content,
        priority: messageData.priority as any,
        category: messageData.category as any,
        status: messageData.status as any,
        isFromUser: Math.random() > 0.7, // 30% chance de ser do usuário
        timestamp: randomDate,
        contactId: randomContact.id,
      },
    });
  }

  console.log('📨 Mensagens de demonstração criadas');

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
