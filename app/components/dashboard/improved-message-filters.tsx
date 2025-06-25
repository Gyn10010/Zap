
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import GuidedTooltip from '@/components/ui/guided-tooltip';
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Tag,
  RefreshCw
} from 'lucide-react';

interface Filters {
  status: string;
  priority: string;
  category: string;
  search: string;
}

interface ImprovedMessageFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  contactsCount: number;
}

export default function ImprovedMessageFilters({ 
  filters, 
  onFiltersChange, 
  contactsCount 
}: ImprovedMessageFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      priority: 'all',
      category: 'all',
      search: '',
    });
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value, index) => value !== '' && (index === 3 || value !== 'all')
  ).length;

  return (
    <div className="space-y-4" data-tutorial="filters">
      {/* Barra de Busca Principal */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <GuidedTooltip content="Digite qualquer palavra para encontrar mensagens específicas. Busca no nome do contato e no conteúdo da mensagem.">
            <Input
              placeholder="Buscar por contato ou mensagem..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </GuidedTooltip>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Botão de Filtros Avançados */}
          <GuidedTooltip content="Clique para abrir filtros avançados e encontrar mensagens por status, prioridade ou etiqueta">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="shrink-0"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </GuidedTooltip>

          {/* Botão Limpar */}
          {activeFiltersCount > 0 && (
            <GuidedTooltip content="Remove todos os filtros aplicados e mostra todas as mensagens">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                <X className="h-4 w-4" />
              </Button>
            </GuidedTooltip>
          )}
        </div>
      </div>

      {/* Filtros Rápidos - Sempre Visíveis */}
      <div className="flex flex-wrap gap-2">
        <GuidedTooltip content="Mostra apenas conversas que ainda precisam de resposta">
          <Button
            variant={filters.status === 'PENDING' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('status', filters.status === 'PENDING' ? 'all' : 'PENDING')}
            className="flex items-center space-x-1"
          >
            <Clock className="h-3 w-3" />
            <span>Pendentes</span>
          </Button>
        </GuidedTooltip>

        <GuidedTooltip content="Mostra apenas mensagens marcadas como urgentes ou importantes">
          <Button
            variant={filters.priority === 'URGENT' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('priority', filters.priority === 'URGENT' ? 'all' : 'URGENT')}
            className="flex items-center space-x-1"
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Urgentes</span>
          </Button>
        </GuidedTooltip>

        <GuidedTooltip content="Mostra conversas que já foram respondidas e finalizadas">
          <Button
            variant={filters.status === 'RESPONDED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('status', filters.status === 'RESPONDED' ? 'all' : 'RESPONDED')}
            className="flex items-center space-x-1"
          >
            <CheckCircle className="h-3 w-3" />
            <span>Respondidas</span>
          </Button>
        </GuidedTooltip>
      </div>

      {/* Filtros Avançados - Expansíveis */}
      {isExpanded && (
        <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Detalhado */}
            <div className="space-y-2">
              <GuidedTooltip content="Filtre mensagens pelo status de atendimento">
                <label className="text-sm font-medium text-gray-700">
                  Status da Conversa
                </label>
              </GuidedTooltip>
              <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="PENDING">Aguardando resposta</SelectItem>
                  <SelectItem value="RESPONDED">Já respondidas</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em atendimento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prioridade */}
            <div className="space-y-2">
              <GuidedTooltip content="Filtre por nível de importância da mensagem">
                <label className="text-sm font-medium text-gray-700">
                  Nível de Prioridade
                </label>
              </GuidedTooltip>
              <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as prioridades</SelectItem>
                  <SelectItem value="LOW">Baixa prioridade</SelectItem>
                  <SelectItem value="MEDIUM">Prioridade normal</SelectItem>
                  <SelectItem value="URGENT">Alta prioridade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Categoria/Tags */}
            <div className="space-y-2">
              <GuidedTooltip content="Filtre mensagens pelas etiquetas que você criou">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Tag className="mr-1 h-3 w-3" />
                  Etiquetas
                </label>
              </GuidedTooltip>
              <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as etiquetas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as etiquetas</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="suporte">Suporte</SelectItem>
                  <SelectItem value="duvidas">Dúvidas</SelectItem>
                  <SelectItem value="orcamentos">Orçamentos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rodapé dos Filtros */}
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-sm text-gray-500">
              {contactsCount > 0 ? (
                <>Filtrando entre {contactsCount} contatos</>
              ) : (
                <>Nenhum contato encontrado</>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              Recolher filtros
            </Button>
          </div>
        </div>
      )}

      {/* Resumo dos Filtros Ativos */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm text-blue-800 font-medium">Filtros ativos:</span>
          {filters.search && (
            <Badge variant="secondary">
              Busca: "{filters.search}"
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('search', '')}
              />
            </Badge>
          )}
          {filters.status !== 'all' && (
            <Badge variant="secondary">
              Status: {filters.status === 'PENDING' ? 'Pendentes' : filters.status === 'RESPONDED' ? 'Respondidas' : 'Em andamento'}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('status', 'all')}
              />
            </Badge>
          )}
          {filters.priority !== 'all' && (
            <Badge variant="secondary">
              Prioridade: {filters.priority === 'URGENT' ? 'Alta' : filters.priority === 'MEDIUM' ? 'Normal' : 'Baixa'}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('priority', 'all')}
              />
            </Badge>
          )}
          {filters.category !== 'all' && (
            <Badge variant="secondary">
              Etiqueta: {filters.category}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('category', 'all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
