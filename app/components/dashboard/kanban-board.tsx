
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import MessageModal from './message-modal';
import { 
  Clock, 
  CheckCircle, 
  Archive,
  AlertTriangle,
  MessageSquare,
  Users,
  Phone,
  Tag,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  content: string;
  type: string;
  status: string;
  priority: string;
  category: string;
  isFromUser: boolean;
  timestamp: string;
  contact: {
    id: string;
    name: string;
    phone: string;
    isGroup: boolean;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
      color: string;
    };
  }>;
}

interface KanbanBoardProps {
  messages: Message[];
  onMessageUpdate: (messageId: string, updates: any) => void;
  loading: boolean;
}

interface Column {
  id: string;
  title: string;
  status: string;
  color: string;
  icon: any;
  count: number;
}

export default function KanbanBoard({ messages, onMessageUpdate, loading }: KanbanBoardProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Definir colunas do Kanban
  const columns: Column[] = [
    {
      id: 'pending',
      title: 'Pendentes',
      status: 'PENDING',
      color: 'bg-yellow-50 border-yellow-200',
      icon: Clock,
      count: messages.filter(m => m.status === 'PENDING').length,
    },
    {
      id: 'read',
      title: 'Lidas',
      status: 'read',
      color: 'bg-blue-50 border-blue-200',
      icon: CheckCircle,
      count: messages.filter(m => m.status === 'read').length,
    },
    {
      id: 'responded',
      title: 'Respondidas',
      status: 'RESPONDED',
      color: 'bg-green-50 border-green-200',
      icon: CheckCircle,
      count: messages.filter(m => m.status === 'RESPONDED').length,
    },
    {
      id: 'archived',
      title: 'Arquivadas',
      status: 'ARCHIVED',
      color: 'bg-gray-50 border-gray-200',
      icon: Archive,
      count: messages.filter(m => m.status === 'ARCHIVED').length,
    },
  ];

  const getContactInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'HIGH':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'NORMAL':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'LOW':
        return 'text-gray-600 bg-gray-100 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const moveMessage = async (messageId: string, newStatus: string) => {
    await onMessageUpdate(messageId, { status: newStatus });
  };

  const getMessagesForColumn = (status: string) => {
    return messages.filter(message => message.status === status);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    }
  };

  const isOverdue = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);
    return diffInHours > 1;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <Card key={column.id} className={`${column.color} min-h-96`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <column.icon className="h-5 w-5" />
                  <span className="font-medium">{column.title}</span>
                </div>
                <Badge variant="secondary">0</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnMessages = getMessagesForColumn(column.status);
          
          return (
            <Card key={column.id} className={`${column.color} min-h-96`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <column.icon className="h-5 w-5" />
                    <span className="font-medium">{column.title}</span>
                  </div>
                  <Badge variant="secondary">{column.count}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {columnMessages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma mensagem</p>
                  </div>
                ) : (
                  columnMessages.map((message) => (
                    <Card 
                      key={message.id}
                      className={`bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 ${
                        message.priority === 'URGENT' ? 'border-l-red-500' :
                        message.priority === 'HIGH' ? 'border-l-orange-500' :
                        message.priority === 'NORMAL' ? 'border-l-blue-500' :
                        'border-l-gray-400'
                      } ${isOverdue(message.timestamp) && message.status === 'PENDING' ? 'ring-2 ring-red-200' : ''}`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <CardContent className="p-3">
                        {/* Header do Card */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <Avatar className="h-6 w-6 flex-shrink-0">
                              <AvatarFallback className={`text-xs ${message.contact.isGroup ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                {message.contact.isGroup ? (
                                  <Users className="h-3 w-3" />
                                ) : (
                                  getContactInitials(message.contact.name)
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium truncate">
                              {message.contact.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500">
                              {formatTime(message.timestamp)}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-5 w-5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  moveMessage(message.id, 'read');
                                }}>
                                  Marcar como lida
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  moveMessage(message.id, 'RESPONDED');
                                }}>
                                  Marcar como respondida
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  moveMessage(message.id, 'ARCHIVED');
                                }}>
                                  Arquivar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Conteúdo da Mensagem */}
                        <p className="text-xs text-gray-700 mb-2 line-clamp-2">
                          {message.content}
                        </p>

                        {/* Badges e Tags */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            {/* Prioridade */}
                            {message.priority !== 'NORMAL' && (
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(message.priority)}`}
                              >
                                {message.priority === 'URGENT' && <AlertTriangle className="h-2 w-2 mr-1" />}
                                {message.priority}
                              </Badge>
                            )}

                            {/* Categoria */}
                            <Badge variant="outline" className="text-xs">
                              {message.category}
                            </Badge>
                          </div>

                          {/* Tags */}
                          {message.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {message.tags.slice(0, 2).map((tagRelation) => (
                                <Badge 
                                  key={tagRelation.tag.id}
                                  variant="outline" 
                                  className="text-xs"
                                  style={{ 
                                    borderColor: tagRelation.tag.color,
                                    color: tagRelation.tag.color,
                                  }}
                                >
                                  <Tag className="h-2 w-2 mr-1" />
                                  {tagRelation.tag.name}
                                </Badge>
                              ))}
                              {message.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{message.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Telefone */}
                          <div className="flex items-center text-xs text-gray-500">
                            <Phone className="h-2 w-2 mr-1" />
                            <span className="truncate">{message.contact.phone}</span>
                          </div>

                          {/* Alerta de Tempo */}
                          {isOverdue(message.timestamp) && message.status === 'PENDING' && (
                            <Badge variant="destructive" className="text-xs w-full justify-center">
                              <Clock className="h-2 w-2 mr-1" />
                              Atrasada
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal de Detalhes da Mensagem */}
      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onUpdate={onMessageUpdate}
        />
      )}
    </div>
  );
}
