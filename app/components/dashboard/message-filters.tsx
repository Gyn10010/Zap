
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Briefcase,
  Tag
} from 'lucide-react';

interface MessageFiltersProps {
  filters: {
    status: string;
    priority: string;
    category: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
  contactsCount: number;
}

export default function MessageFilters({ filters, onFiltersChange, contactsCount }: MessageFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
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

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.priority !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.search) count++;
    return count;
  };

  const statusOptions = [
    { value: 'all', label: 'Todos os Status', icon: null },
    { value: 'PENDING', label: 'Pendentes', icon: Clock, color: 'text-yellow-600' },
    { value: 'READ', label: 'Lidas', icon: CheckCircle, color: 'text-blue-600' },
    { value: 'RESPONDED', label: 'Respondidas', icon: CheckCircle, color: 'text-green-600' },
    { value: 'ARCHIVED', label: 'Arquivadas', icon: Tag, color: 'text-gray-600' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'Todas as Prioridades', icon: null },
    { value: 'URGENT', label: 'Urgente', icon: AlertTriangle, color: 'text-red-600' },
    { value: 'HIGH', label: 'Alta', icon: AlertTriangle, color: 'text-orange-600' },
    { value: 'NORMAL', label: 'Normal', icon: null, color: 'text-blue-600' },
    { value: 'LOW', label: 'Baixa', icon: null, color: 'text-gray-600' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas as Categorias', icon: null },
    { value: 'PERSONAL', label: 'Pessoal', icon: User, color: 'text-purple-600' },
    { value: 'PROFESSIONAL', label: 'Profissional', icon: Briefcase, color: 'text-indigo-600' },
    { value: 'SALES', label: 'Vendas', icon: null, color: 'text-green-600' },
    { value: 'SUPPORT', label: 'Suporte', icon: null, color: 'text-orange-600' },
    { value: 'MARKETING', label: 'Marketing', icon: null, color: 'text-pink-600' },
    { value: 'OTHER', label: 'Outros', icon: null, color: 'text-gray-600' },
  ];

  return (
    <div className="space-y-4">
      {/* Filtros Principais */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar mensagens, contatos..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status */}
            <div className="w-full lg:w-48">
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        {option.icon && (
                          <option.icon className={`h-4 w-4 ${option.color}`} />
                        )}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prioridade */}
            <div className="w-full lg:w-48">
              <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        {option.icon && (
                          <option.icon className={`h-4 w-4 ${option.color}`} />
                        )}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Controles */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={showAdvanced ? 'bg-gray-100' : ''}
              >
                <Filter className="h-4 w-4" />
              </Button>
              
              {getActiveFiltersCount() > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Filtros Avançados */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                    Categoria
                  </Label>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            {option.icon && (
                              <option.icon className={`h-4 w-4 ${option.color}`} />
                            )}
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Filtros Ativos */}
          {getActiveFiltersCount() > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Filtros ativos:</span>
                <div className="flex flex-wrap gap-2">
                  {filters.status !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Status: {statusOptions.find(o => o.value === filters.status)?.label}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 text-gray-500 hover:text-gray-700"
                        onClick={() => handleFilterChange('status', 'all')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  
                  {filters.priority !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Prioridade: {priorityOptions.find(o => o.value === filters.priority)?.label}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 text-gray-500 hover:text-gray-700"
                        onClick={() => handleFilterChange('priority', 'all')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  
                  {filters.category !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Categoria: {categoryOptions.find(o => o.value === filters.category)?.label}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 text-gray-500 hover:text-gray-700"
                        onClick={() => handleFilterChange('category', 'all')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  
                  {filters.search && (
                    <Badge variant="secondary" className="text-xs">
                      Busca: "{filters.search}"
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 text-gray-500 hover:text-gray-700"
                        onClick={() => handleFilterChange('search', '')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
