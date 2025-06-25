
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MessageSquare, 
  Settings, 
  Tag, 
  Smartphone,
  HelpCircle,
  Book,
  Video,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Star
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface HelpCenterProps {
  onStartTutorial: () => void;
}

const helpCategories = [
  {
    id: 'getting-started',
    title: 'Primeiros Passos',
    icon: MessageSquare,
    color: 'bg-green-100 text-green-600',
    articles: [
      { title: 'Como configurar minha conta', duration: '2 min' },
      { title: 'Conectar WhatsApp Business', duration: '5 min' },
      { title: 'Criar minhas primeiras etiquetas', duration: '3 min' },
    ]
  },
  {
    id: 'messages',
    title: 'Gerenciar Mensagens',
    icon: MessageCircle,
    color: 'bg-blue-100 text-blue-600',
    articles: [
      { title: 'Como responder mensagens', duration: '2 min' },
      { title: 'Organizar com etiquetas', duration: '4 min' },
      { title: 'Filtrar conversas', duration: '3 min' },
    ]
  },
  {
    id: 'settings',
    title: 'Configurações',
    icon: Settings,
    color: 'bg-purple-100 text-purple-600',
    articles: [
      { title: 'Personalizar notificações', duration: '3 min' },
      { title: 'Configurar horário de trabalho', duration: '2 min' },
      { title: 'Ajustar alertas de tempo', duration: '2 min' },
    ]
  }
];

const faqItems = [
  {
    question: 'Como conectar meu WhatsApp Business?',
    answer: 'Para conectar seu WhatsApp Business, vá em Configurações > WhatsApp e siga o guia passo-a-passo. Você precisará do número da sua conta WhatsApp Business e das credenciais da API.'
  },
  {
    question: 'Minhas mensagens são seguras?',
    answer: 'Sim! Todos os dados são criptografados e armazenados com segurança. Seguimos as melhores práticas de segurança e estamos em conformidade com a LGPD.'
  },
  {
    question: 'Como criar etiquetas para organizar mensagens?',
    answer: 'Você pode criar etiquetas na seção Configurações ou diretamente nas mensagens. Clique no ícone de etiqueta em qualquer conversa para adicionar ou criar novas tags.'
  },
  {
    question: 'Posso usar sem conectar o WhatsApp?',
    answer: 'Sim! Você pode usar o modo demonstração para testar todas as funcionalidades antes de conectar sua conta real do WhatsApp Business.'
  },
  {
    question: 'Como recebo notificações de novas mensagens?',
    answer: 'Configure as notificações em Configurações > Notificações. Você pode escolher receber alertas no navegador e definir quando ser notificado sobre mensagens não respondidas.'
  }
];

export default function HelpCenter({ onStartTutorial }: HelpCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Cabeçalho */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Central de Ajuda</h1>
        <p className="text-gray-600">
          Encontre respostas, tutoriais e guias para aproveitar ao máximo seu organizador de WhatsApp
        </p>
        
        {/* Busca */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar ajuda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onStartTutorial}>
          <CardContent className="p-6 text-center">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Video className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Tutorial Interativo</h3>
            <p className="text-sm text-gray-600 mb-4">
              Aprenda usando a interface real em 2 minutos
            </p>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Começar Tutorial
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Guia WhatsApp Business</h3>
            <p className="text-sm text-gray-600 mb-4">
              Como configurar e conectar sua conta
            </p>
            <Button size="sm" variant="outline">
              Ver Guia
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Fale Conosco</h3>
            <p className="text-sm text-gray-600 mb-4">
              Precisa de ajuda personalizada?
            </p>
            <Button size="sm" variant="outline">
              Entrar em Contato
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Categorias de Ajuda */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Guias por Categoria</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {helpCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <span>{category.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.articles.map((article, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <Book className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{article.title}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant="outline" className="text-xs">
                        {article.duration}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Perguntas Frequentes</h2>
        
        <Accordion type="single" collapsible className="w-full">
          {filteredFAQ.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Feedback */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">Esta página foi útil?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Sua opinião nos ajuda a melhorar a experiência para todos
          </p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant="ghost"
                size="sm"
                className="p-1"
              >
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
