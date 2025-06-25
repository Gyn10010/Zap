
'use client';

import { useState, useEffect } from 'react';
import ImprovedHeader from './improved-header';
import ImprovedMessageFilters from './improved-message-filters';
import ImprovedMessageList from './improved-message-list';
import KanbanBoard from './kanban-board';
import ImprovedQuickActions from './improved-quick-actions';
import OnboardingWizard from '@/components/onboarding/onboarding-wizard';
import TutorialOverlay from '@/components/tutorial/tutorial-overlay';
import GuidedTooltip from '@/components/ui/guided-tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Grid3X3,
  List,
  Info,
  Loader2,
  Sparkles,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImprovedDashboard() {
  const { toast } = useToast();
  
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    responded: 0,
    urgent: 0,
    unreadTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  });
  
  // Estados para onboarding e tutorial
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Verificar se é primeira visita
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('whatsapp-manager-onboarding-completed');
    if (!hasSeenOnboarding) {
      setIsFirstTime(true);
      setShowOnboarding(true);
    }
  }, []);

  // Carregar dados iniciais com debounce para melhor performance
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Construir query params
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value);
        }
      });

      const [messagesRes, contactsRes] = await Promise.all([
        fetch(`/api/messages?${params.toString()}`),
        fetch('/api/contacts')
      ]);

      if (messagesRes.ok && contactsRes.ok) {
        const messagesData = await messagesRes.json();
        const contactsData = await contactsRes.json();
        
        // Mapear dados das mensagens para o formato esperado pelo componente
        const mappedMessages = messagesData.map((message: any) => ({
          ...message,
          contactName: message.contact?.name || 'Contato desconhecido',
          tags: message.tags?.map((tagRel: any) => tagRel.tag?.name).filter(Boolean) || []
        }));
        
        setMessages(mappedMessages);
        setContacts(contactsData);
        
        // Calcular estatísticas
        const stats = {
          total: messagesData.length,
          pending: messagesData.filter((m: any) => m.status === 'PENDING').length,
          responded: messagesData.filter((m: any) => m.status === 'RESPONDED').length,
          urgent: messagesData.filter((m: any) => m.priority === 'URGENT').length,
          unreadTime: messagesData.filter((m: any) => {
            const hoursDiff = (new Date().getTime() - new Date(m.timestamp).getTime()) / (1000 * 60 * 60);
            return m.status === 'PENDING' && hoursDiff > 1;
          }).length
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDemoData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/simulator', {
        method: 'GET',
      });

      if (response.ok) {
        await loadData();
        toast({
          title: "Sucesso! 🎉",
          description: "Dados de demonstração criados. Agora você pode explorar o sistema!",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Erro ao gerar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar dados de demonstração",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMessageUpdate = async (messageId: string, updates: any) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await loadData();
        toast({
          title: "Sucesso",
          description: "Mensagem atualizada com sucesso",
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar mensagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar mensagem",
        variant: "destructive",
      });
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('whatsapp-manager-onboarding-completed', 'true');
    setShowOnboarding(false);
    setIsFirstTime(false);
    
    // Mostrar dados demo automaticamente
    if (messages.length === 0) {
      generateDemoData();
    }
    
    toast({
      title: "Bem-vindo! 🎉",
      description: "Configuração concluída! Explore seu organizador de WhatsApp.",
    });
  };

  const handleStartTutorial = () => {
    setShowTutorial(true);
  };

  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ImprovedHeader onStartTutorial={handleStartTutorial} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
              <p className="text-gray-600">Carregando suas mensagens...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ImprovedHeader onStartTutorial={handleStartTutorial} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensagem de boas-vindas para usuários sem dados */}
        {!isFirstTime && messages.length === 0 && (
          <Alert className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <Heart className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-800 mb-1">
                    Olá! 👋
                  </p>
                  <p className="text-green-700">
                    Seu organizador está pronto! Conecte seu WhatsApp ou experimente com dados de demonstração.
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <GuidedTooltip content="Cria conversas de exemplo para você testar todas as funcionalidades">
                    <Button 
                      onClick={generateDemoData}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Testar com Demo
                    </Button>
                  </GuidedTooltip>
                  <GuidedTooltip content="Aprenda a usar o sistema com um tutorial interativo">
                    <Button 
                      variant="outline"
                      onClick={handleStartTutorial}
                    >
                      Tutorial
                    </Button>
                  </GuidedTooltip>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Estatísticas com Tooltips */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8" data-tutorial="stats">
          <GuidedTooltip content="Número total de conversas que você tem">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">conversas</p>
              </CardContent>
            </Card>
          </GuidedTooltip>

          <GuidedTooltip content="Conversas que ainda não foram respondidas - estas precisam da sua atenção">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">precisam de resposta</p>
              </CardContent>
            </Card>
          </GuidedTooltip>

          <GuidedTooltip content="Conversas que já foram atendidas e finalizadas">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Respondidas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.responded}</div>
                <p className="text-xs text-muted-foreground">já atendidas</p>
              </CardContent>
            </Card>
          </GuidedTooltip>

          <GuidedTooltip content="Mensagens marcadas como urgentes ou de alta prioridade">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
                <p className="text-xs text-muted-foreground">alta prioridade</p>
              </CardContent>
            </Card>
          </GuidedTooltip>

          <GuidedTooltip content="Mensagens não respondidas há mais de 1 hora - podem estar atrasadas">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.unreadTime}</div>
                <p className="text-xs text-muted-foreground">há mais de 1h</p>
              </CardContent>
            </Card>
          </GuidedTooltip>
        </div>

        {/* Filtros e Controles */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <ImprovedMessageFilters 
            filters={filters} 
            onFiltersChange={setFilters}
            contactsCount={contacts.length}
          />
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {messages.length} conversas
            </Badge>
            <div className="flex items-center bg-white rounded-lg border" data-tutorial="view-toggle">
              <GuidedTooltip content="Visualizar mensagens em formato de lista (recomendado)">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </GuidedTooltip>
              <GuidedTooltip content="Visualizar mensagens em quadros organizados por status (visual)">
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                  className="rounded-l-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </GuidedTooltip>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {viewMode === 'list' ? (
              <ImprovedMessageList 
                messages={messages}
                onMessageUpdate={handleMessageUpdate}
                loading={loading}
              />
            ) : (
              <KanbanBoard 
                messages={messages}
                onMessageUpdate={handleMessageUpdate}
                loading={loading}
              />
            )}
          </div>
          
          <div className="lg:col-span-1">
            <ImprovedQuickActions 
              onRefresh={loadData}
              stats={stats}
              onStartTutorial={handleStartTutorial}
            />
          </div>
        </div>
      </div>

      {/* Onboarding Wizard */}
      <OnboardingWizard
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onClose={() => {
          setShowOnboarding(false);
          setIsFirstTime(false);
        }}
      />

      {/* Tutorial Overlay */}
      <TutorialOverlay 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />
    </div>
  );
}
