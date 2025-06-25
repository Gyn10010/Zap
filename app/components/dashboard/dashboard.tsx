
'use client';

import { useState, useEffect } from 'react';
import Header from './header';
import MessageFilters from './message-filters';
import MessageList from './message-list';
import KanbanBoard from './kanban-board';
import QuickActions from './quick-actions';
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
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
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
  const [showWelcome, setShowWelcome] = useState(true);

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
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
        
        setMessages(messagesData);
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
        setShowWelcome(false);
        toast({
          title: "Sucesso!",
          description: "Dados de demonstração criados com sucesso",
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

  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
              <p className="text-gray-600">Carregando mensagens...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message para novos usuários */}
        {showWelcome && messages.length === 0 && (
          <Alert className="mb-8 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-800 mb-1">
                    Bem-vindo ao WhatsApp Manager!
                  </p>
                  <p className="text-blue-700">
                    Para começar, você pode gerar dados de demonstração ou conectar sua conta WhatsApp.
                  </p>
                </div>
                <Button 
                  onClick={generateDemoData}
                  className="ml-4 bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Gerar Demo
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">mensagens</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">aguardando resposta</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Respondidas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.responded}</div>
              <p className="text-xs text-muted-foreground">já atendidas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
              <p className="text-xs text-muted-foreground">alta prioridade</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.unreadTime}</div>
              <p className="text-xs text-muted-foreground">há mais de 1h</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Controles */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <MessageFilters 
            filters={filters} 
            onFiltersChange={setFilters}
            contactsCount={contacts.length}
          />
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {messages.length} mensagens
            </Badge>
            <div className="flex items-center bg-white rounded-lg border">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="rounded-l-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {viewMode === 'list' ? (
              <MessageList 
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
            <QuickActions 
              onRefresh={loadData}
              stats={stats}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
