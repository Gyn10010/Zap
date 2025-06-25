
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MessageModal from './message-modal';
import { 
  MessageSquare, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  MoreVertical,
  Reply,
  Archive,
  Tag,
  User,
  Users,
  Image,
  FileText,
  Video
} from 'lucide-react';

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

interface MessageListProps {
  messages: Message[];
  onMessageUpdate: (messageId: string, updates: any) => void;
  loading: boolean;
}

export default function MessageList({ messages, onMessageUpdate, loading }: MessageListProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'READ':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'RESPONDED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'NORMAL':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'LOW':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return <Image className="h-4 w-4" />;
      case 'VIDEO':
        return <Video className="h-4 w-4" />;
      case 'DOCUMENT':
        return <FileText className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getContactInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return format(messageTime, 'dd/MM/yyyy', { locale: ptBR });
  };

  const isOverdue = (timestamp: string, status: string) => {
    if (status !== 'PENDING') return false;
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);
    return diffInHours > 1; // Considera atrasado após 1 hora
  };

  const markAsRead = async (messageId: string) => {
    await onMessageUpdate(messageId, { status: 'READ', isRead: true });
  };

  const markAsResponded = async (messageId: string) => {
    await onMessageUpdate(messageId, { 
      status: 'RESPONDED', 
      isRead: true,
      respondedAt: new Date().toISOString()
    });
  };

  const changePriority = async (messageId: string, priority: string) => {
    await onMessageUpdate(messageId, { priority });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma mensagem encontrada</h3>
          <p className="text-gray-500">
            Ajuste os filtros ou aguarde novas mensagens chegarem.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card 
          key={message.id} 
          className={`transition-all hover:shadow-md cursor-pointer ${
            isOverdue(message.timestamp, message.status) ? 'ring-2 ring-red-200 bg-red-50/50' : ''
          } ${!message.isFromUser && message.status === 'PENDING' ? 'bg-yellow-50/30' : ''}`}
          onClick={() => setSelectedMessage(message)}
        >
          <CardContent className="p-4">
            <div className="flex space-x-3">
              {/* Avatar do Contato */}
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`${message.contact.isGroup ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {message.contact.isGroup ? (
                      <Users className="h-5 w-5" />
                    ) : (
                      getContactInitials(message.contact.name)
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Conteúdo da Mensagem */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {message.contact.name}
                    </h4>
                    {message.contact.isGroup && (
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        Grupo
                      </Badge>
                    )}
                    <div className="flex items-center space-x-1">
                      {getTypeIcon(message.type)}
                      {getStatusIcon(message.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(message.timestamp)}
                    </span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(message.id);
                        }}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marcar como lida
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          markAsResponded(message.id);
                        }}>
                          <Reply className="mr-2 h-4 w-4" />
                          Marcar como respondida
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          changePriority(message.id, 'URGENT');
                        }}>
                          <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                          Marcar como urgente
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onMessageUpdate(message.id, { status: 'ARCHIVED' });
                        }}>
                          <Archive className="mr-2 h-4 w-4" />
                          Arquivar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Conteúdo da mensagem */}
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                  {message.content}
                </p>

                {/* Tags e Badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* Badge de Prioridade */}
                    {message.priority !== 'NORMAL' && (
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(message.priority)}`}>
                        {message.priority === 'URGENT' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {message.priority}
                      </Badge>
                    )}

                    {/* Badge de Categoria */}
                    <Badge variant="outline" className="text-xs">
                      {message.category}
                    </Badge>

                    {/* Tags */}
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
                        <Tag className="h-3 w-3 mr-1" />
                        {tagRelation.tag.name}
                      </Badge>
                    ))}
                    
                    {message.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{message.tags.length - 2} tags
                      </Badge>
                    )}
                  </div>

                  {/* Alerta de Tempo */}
                  {isOverdue(message.timestamp, message.status) && (
                    <Badge variant="destructive" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Atrasada
                    </Badge>
                  )}
                </div>

                {/* Telefone */}
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Phone className="h-3 w-3 mr-1" />
                  {message.contact.phone}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

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
