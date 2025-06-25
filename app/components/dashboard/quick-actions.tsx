
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, 
  Plus, 
  Settings, 
  BarChart3,
  Smartphone,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Brain,
  Tag,
  Zap,
  Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuickActionsProps {
  onRefresh: () => void;
  stats: {
    total: number;
    pending: number;
    responded: number;
    urgent: number;
    unreadTime: number;
  };
}

export default function QuickActions({ onRefresh, stats }: QuickActionsProps) {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getResponseRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.responded / stats.total) * 100);
  };

  const getPendingPercentage = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.pending / stats.total) * 100);
  };

  const getUrgentPercentage = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.urgent / stats.total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span>Ações Rápidas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-full"
            variant="outline"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>

          <Button 
            onClick={() => router.push('/simulator')}
            className="w-full"
            variant="outline"
          >
            <Smartphone className="mr-2 h-4 w-4" />
            Simulador WhatsApp
          </Button>

          <Button 
            onClick={() => router.push('/settings')}
            className="w-full"
            variant="outline"
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>

          <Button 
            onClick={() => router.push('/analytics')}
            className="w-full"
            variant="outline"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Relatórios
          </Button>
        </CardContent>
      </Card>

      {/* Resumo de Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Taxa de Resposta */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Taxa de Resposta</span>
              <Badge variant="secondary">{getResponseRate()}%</Badge>
            </div>
            <Progress value={getResponseRate()} className="h-2" />
          </div>

          {/* Mensagens Pendentes */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Pendentes</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {getPendingPercentage()}%
              </Badge>
            </div>
            <Progress value={getPendingPercentage()} className="h-2" />
          </div>

          {/* Mensagens Urgentes */}
          {stats.urgent > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Urgentes</span>
                <Badge variant="destructive">
                  {getUrgentPercentage()}%
                </Badge>
              </div>
              <Progress value={getUrgentPercentage()} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alertas e Notificações */}
      {(stats.urgent > 0 || stats.unreadTime > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>Alertas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.urgent > 0 && (
              <div className="flex items-center space-x-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-red-700">
                  {stats.urgent} mensagem{stats.urgent > 1 ? 's' : ''} urgente{stats.urgent > 1 ? 's' : ''}
                </span>
              </div>
            )}

            {stats.unreadTime > 0 && (
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-orange-700">
                  {stats.unreadTime} mensagem{stats.unreadTime > 1 ? 's' : ''} atrasada{stats.unreadTime > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Estatísticas Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <span>Resumo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.responded}</div>
              <div className="text-xs text-gray-500">Respondidas</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-xs text-gray-500">Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
              <div className="text-xs text-gray-500">Urgentes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dicas e Ajuda */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>Dicas IA</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-700">
            {stats.pending > 10 && (
              <div className="flex items-start space-x-2">
                <MessageSquare className="h-4 w-4 mt-0.5" />
                <span>Você tem muitas mensagens pendentes. Use filtros para priorizar.</span>
              </div>
            )}
            
            {stats.urgent > 0 && (
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <span>Foque primeiro nas mensagens urgentes para melhor atendimento.</span>
              </div>
            )}
            
            {getResponseRate() < 70 && stats.total > 5 && (
              <div className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 mt-0.5" />
                <span>Use respostas rápidas para aumentar sua taxa de resposta.</span>
              </div>
            )}

            {stats.total === 0 && (
              <div className="flex items-start space-x-2">
                <Smartphone className="h-4 w-4 mt-0.5" />
                <span>Experimente o simulador para testar as funcionalidades do sistema.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
