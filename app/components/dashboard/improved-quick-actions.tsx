
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GuidedTooltip from '@/components/ui/guided-tooltip';
import { 
  Settings, 
  RefreshCw, 
  Plus, 
  Tag, 
  HelpCircle,
  BarChart3,
  Smartphone,
  Clock,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  MessageSquare,
  Loader2
} from 'lucide-react';

interface Stats {
  total: number;
  pending: number;
  responded: number;
  urgent: number;
  unreadTime: number;
}

interface ImprovedQuickActionsProps {
  onRefresh: () => void;
  stats: Stats;
  onStartTutorial?: () => void;
}

export default function ImprovedQuickActions({ 
  onRefresh, 
  stats, 
  onStartTutorial 
}: ImprovedQuickActionsProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const urgentPercentage = stats.total > 0 ? (stats.urgent / stats.total) * 100 : 0;
  const responseRate = stats.total > 0 ? (stats.responded / stats.total) * 100 : 0;

  return (
    <div className="space-y-6" data-tutorial="quick-actions">
      {/* Resumo Rápido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Resumo Rápido</span>
            </div>
            <GuidedTooltip content="Atualiza os dados das mensagens em tempo real">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </GuidedTooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-tutorial="stats">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-blue-700">Total de mensagens</div>
            </div>
            
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-xs text-yellow-700">Aguardando resposta</div>
            </div>
          </div>

          {/* Alertas Importantes */}
          {stats.urgent > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  {stats.urgent} mensagens urgentes
                </span>
              </div>
              <div className="text-xs text-red-700">
                Precisam de atenção imediata
              </div>
            </div>
          )}

          {stats.unreadTime > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  {stats.unreadTime} mensagens atrasadas
                </span>
              </div>
              <div className="text-xs text-orange-700">
                Não respondidas há mais de 1 hora
              </div>
            </div>
          )}

          {/* Taxa de Resposta */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxa de resposta</span>
              <span className="font-medium">{responseRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${responseRate}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-green-600" />
            <span>Ações Rápidas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <GuidedTooltip content="Crie novas etiquetas para organizar melhor suas mensagens">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/settings')}
            >
              <Tag className="mr-2 h-4 w-4" />
              Criar Etiquetas
            </Button>
          </GuidedTooltip>

          <GuidedTooltip content="Configure notificações, horários de trabalho e preferências">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </GuidedTooltip>

          <GuidedTooltip content="Conecte ou configure sua conta do WhatsApp Business">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/settings')}
            >
              <Smartphone className="mr-2 h-4 w-4" />
              WhatsApp Business
            </Button>
          </GuidedTooltip>

          {onStartTutorial && (
            <GuidedTooltip content="Aprenda a usar todas as funcionalidades com um tutorial interativo">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={onStartTutorial}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Tutorial Interativo
              </Button>
            </GuidedTooltip>
          )}
        </CardContent>
      </Card>

      {/* Dicas e Ajuda */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-green-600" />
            <span>Precisa de Ajuda?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Acesse nossa central de ajuda para tutoriais, guias e suporte.
          </p>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/help')}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Central de Ajuda
          </Button>

          <div className="text-xs text-gray-500 text-center">
            💡 Dica: Use Ctrl+H para acesso rápido à ajuda
          </div>
        </CardContent>
      </Card>

      {/* Status de Conexão */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">Sistema Online</span>
            </div>
            <Badge variant="outline" className="text-xs">
              Conectado
            </Badge>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            Última atualização: agora mesmo
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
