
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/dashboard/header';
import { 
  Smartphone, 
  Send, 
  MessageSquare, 
  Users,
  Plus,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Bot,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface DemoContact {
  name: string;
  phone: string;
  isGroup?: boolean;
}

interface DemoMessage {
  contact: string;
  content: string;
  type: 'urgent' | 'sales' | 'support' | 'personal';
}

export default function WhatsAppSimulator() {
  const [selectedContact, setSelectedContact] = useState<DemoContact | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [sending, setSending] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showNewContact, setShowNewContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Contatos de demonstração
  const demoContacts: DemoContact[] = [
    { name: 'João Silva', phone: '+5511999888777' },
    { name: 'Maria Santos', phone: '+5511888777666' },
    { name: 'Pedro Costa', phone: '+5511777666555' },
    { name: 'Ana Lima', phone: '+5511666555444' },
    { name: 'Grupo Projeto ABC', phone: '+5511555444333', isGroup: true },
    { name: 'Carlos Ferreira', phone: '+5511444333222' },
    { name: 'Luana Oliveira', phone: '+5511333222111' },
  ];

  // Mensagens de exemplo por categoria
  const demoMessages: DemoMessage[] = [
    // Urgentes
    { contact: 'Cliente Urgente', content: 'URGENTE: Preciso de ajuda agora! O sistema não está funcionando!', type: 'urgent' },
    { contact: 'Emergência', content: 'Socorro! Meu pedido tinha que chegar hoje e não chegou. Cliente muito bravo!', type: 'urgent' },
    { contact: 'Problema Crítico', content: 'EMERGÊNCIA: Site fora do ar há 2 horas, estou perdendo vendas!', type: 'urgent' },
    
    // Vendas
    { contact: 'Lead Quente', content: 'Olá! Vi seu produto no Instagram. Quanto custa e qual o prazo de entrega?', type: 'sales' },
    { contact: 'Interessado', content: 'Bom dia! Gostaria de um orçamento para 50 unidades do produto X.', type: 'sales' },
    { contact: 'Cliente Potencial', content: 'Oi! Minha amiga comprou com vocês e amou. Pode me passar os preços?', type: 'sales' },
    { contact: 'Comprador', content: 'Quero finalizar a compra que começamos ontem. Como faço o pagamento?', type: 'sales' },
    
    // Suporte
    { contact: 'Dúvida Técnica', content: 'Oi! Estou com dificuldade para configurar o produto. Podem me ajudar?', type: 'support' },
    { contact: 'Problema', content: 'O produto chegou com defeito. Como faço para trocar?', type: 'support' },
    { contact: 'Tutorial', content: 'Não estou conseguindo fazer login na plataforma. Podem me orientar?', type: 'support' },
    
    // Pessoal
    { contact: 'Amigo', content: 'E aí! Como está indo com o novo negócio?', type: 'personal' },
    { contact: 'Família', content: 'Oi filho! Lembrete: jantar domingo na casa da vovó!', type: 'personal' },
    { contact: 'Parceiro', content: 'Parabéns pelo sucesso! Vi a matéria sobre sua empresa no jornal!', type: 'personal' },
  ];

  const sendMessage = async () => {
    if (!selectedContact || !messageContent.trim()) {
      toast({
        title: "Erro",
        description: "Selecione um contato e digite uma mensagem",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);

      // Criar contato se não existir
      await fetch('/api/simulator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_contact',
          contactName: selectedContact.name,
          phone: selectedContact.phone,
        }),
      });

      // Enviar mensagem
      const response = await fetch('/api/simulator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_message',
          phone: selectedContact.phone,
          content: messageContent,
          messageType: 'TEXT',
        }),
      });

      if (response.ok) {
        toast({
          title: "Mensagem enviada!",
          description: `Mensagem enviada para ${selectedContact.name}`,
        });
        setMessageContent('');
        
        // Aguardar um pouco e fazer classificação automática
        setTimeout(async () => {
          try {
            await fetch('/api/messages/classify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                content: messageContent,
              }),
            });
          } catch (error) {
            console.error('Erro na classificação:', error);
          }
        }, 1000);
      } else {
        throw new Error('Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const createContact = async () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      toast({
        title: "Erro",
        description: "Preencha nome e telefone",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreating(true);
      
      const response = await fetch('/api/simulator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_contact',
          contactName: newContactName,
          phone: newContactPhone,
        }),
      });

      if (response.ok) {
        toast({
          title: "Contato criado!",
          description: `${newContactName} adicionado com sucesso`,
        });
        setNewContactName('');
        setNewContactPhone('');
        setShowNewContact(false);
        setSelectedContact({ name: newContactName, phone: newContactPhone, isGroup });
      }
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar contato",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const sendDemoMessage = async (demoMessage: DemoMessage) => {
    try {
      setSending(true);

      // Criar contato temporário
      const tempContact = {
        name: demoMessage.contact,
        phone: `+5511${Math.random().toString().substr(2, 9)}`,
        isGroup: false,
      };

      // Criar contato
      await fetch('/api/simulator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_contact',
          contactName: tempContact.name,
          phone: tempContact.phone,
        }),
      });

      // Enviar mensagem
      const response = await fetch('/api/simulator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_message',
          phone: tempContact.phone,
          content: demoMessage.content,
          messageType: 'TEXT',
        }),
      });

      if (response.ok) {
        toast({
          title: "Mensagem de demo enviada!",
          description: `Mensagem ${demoMessage.type} simulada`,
        });
      }
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem de demo",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const generateRandomMessages = async () => {
    try {
      setSending(true);
      
      const response = await fetch('/api/simulator', {
        method: 'GET',
      });

      if (response.ok) {
        toast({
          title: "Dados gerados!",
          description: "Mensagens de demonstração criadas com sucesso",
        });
      }
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar dados",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Simulador WhatsApp</h1>
              <p className="text-gray-600">Simule o recebimento de mensagens para testar o sistema</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={generateRandomMessages} disabled={sending}>
              <Bot className="mr-2 h-4 w-4" />
              Gerar Dados Demo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interface do WhatsApp */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-6 w-6" />
                  <span>WhatsApp Business Simulator</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Lista de Contatos */}
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Contatos</h3>
                    <Button 
                      size="sm" 
                      onClick={() => setShowNewContact(!showNewContact)}
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Contato
                    </Button>
                  </div>

                  {/* Formulário de Novo Contato */}
                  {showNewContact && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
                      <Input
                        placeholder="Nome do contato"
                        value={newContactName}
                        onChange={(e) => setNewContactName(e.target.value)}
                      />
                      <Input
                        placeholder="+55 11 99999-9999"
                        value={newContactPhone}
                        onChange={(e) => setNewContactPhone(e.target.value)}
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isGroup"
                          checked={isGroup}
                          onChange={(e) => setIsGroup(e.target.checked)}
                          className="rounded"
                        />
                        <label htmlFor="isGroup" className="text-sm">É um grupo</label>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={createContact}
                          disabled={creating}
                        >
                          {creating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Criar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowNewContact(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Lista de Contatos Demo */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {demoContacts.map((contact, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedContact(contact)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedContact?.phone === contact.phone 
                            ? 'bg-green-100 border-green-300' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${contact.isGroup ? 'bg-purple-100' : 'bg-green-100'}`}>
                            {contact.isGroup ? (
                              <Users className="h-4 w-4 text-purple-600" />
                            ) : (
                              <MessageSquare className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{contact.name}</div>
                            <div className="text-xs text-gray-500">{contact.phone}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Área de Envio */}
                <div className="p-4">
                  {selectedContact ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-full ${selectedContact.isGroup ? 'bg-purple-100' : 'bg-green-100'}`}>
                          {selectedContact.isGroup ? (
                            <Users className="h-4 w-4 text-purple-600" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{selectedContact.name}</div>
                          <div className="text-sm text-gray-500">{selectedContact.phone}</div>
                        </div>
                      </div>

                      <Textarea
                        placeholder="Digite sua mensagem..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        rows={4}
                      />

                      <Button 
                        onClick={sendMessage}
                        disabled={sending || !messageContent.trim()}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {sending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Simular Envio
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Selecione um contato para simular o envio de mensagens
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mensagens de Exemplo */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span>Mensagens Rápidas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {demoMessages.slice(0, 8).map((message, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          variant={
                            message.type === 'urgent' ? 'destructive' :
                            message.type === 'sales' ? 'default' :
                            message.type === 'support' ? 'secondary' :
                            'outline'
                          }
                          className="text-xs"
                        >
                          {message.type.toUpperCase()}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => sendDemoMessage(message)}
                          disabled={sending}
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-sm font-medium mb-1">{message.contact}</div>
                      <div className="text-xs text-gray-600 line-clamp-2">{message.content}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instruções */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Como usar</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-700 space-y-2">
                <p>1. Selecione ou crie um contato</p>
                <p>2. Digite uma mensagem ou use as mensagens rápidas</p>
                <p>3. Clique em "Simular Envio"</p>
                <p>4. A mensagem será processada pela IA e aparecerá no dashboard</p>
                <p>5. Use "Gerar Dados Demo" para criar várias mensagens de uma vez</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
