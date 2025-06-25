
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import GuidedTooltip from '@/components/ui/guided-tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  MoreHorizontal,
  Reply,
  Tag,
  Star,
  Archive,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Message {
  id: string;
  contactName: string;
  content: string;
  timestamp: string;
  status: 'PENDING' | 'RESPONDED' | 'IN_PROGRESS';
  priority: 'LOW' | 'MEDIUM' | 'URGENT';
  tags?: string[];
}

interface ImprovedMessageListProps {
  messages: Message[];
  onMessageUpdate: (messageId: string, updates: any) => void;
  loading: boolean;
}

export default function ImprovedMessageList({ 
  messages, 
  onMessageUpdate, 
  loading 
}: ImprovedMessageListProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'RESPONDED': return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Aguardando';
      case 'RESPONDED': return 'Respondida';
      case 'IN_PROGRESS': return 'Em atendimento';
      default: return status;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'URGENT': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'MEDIUM': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const handleQuickAction = async (messageId: string, action: string, updates: any) => {
    setActionLoading(messageId);
    try {
      await onMessageUpdate(messageId, updates);
    } finally {
      setActionLoading(null);
    }
  };

  const getInitials = (name: string | undefined) => {
    if (!name || typeof name !== 'string') {
      return 'NA';
    }
    return name
      .split(' ')
      .map(word => word && word[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'NA';
  };

  if (loading && messages.length === 0) {
    return (
      <Card data-tutorial="messages-list">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Carregando suas conversas...</p>
        </CardContent>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card data-tutorial="messages-list">
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhuma conversa encontrada
          </h3>
          <p className="text-gray-600 mb-4">
            Suas mensagens aparecerão aqui quando chegarem ou você pode testar com dados de demonstração.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3" data-tutorial="messages-list">
        {messages.map((message) => {
          const timeSince = formatDistanceToNow(new Date(message.timestamp), { 
            addSuffix: true, 
            locale: ptBR 
          });

          return (
            <Card 
              key={message.id} 
              className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-green-500"
              onClick={() => setSelectedMessage(message)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green-100 text-green-600">
                      {getInitials(message.contactName)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Conteúdo Principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {message.contactName}
                        </h3>
                        {getPriorityIcon(message.priority)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(message.status)}>
                          {getStatusLabel(message.status)}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                      {message.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{timeSince}</span>
                        {message.tags && message.tags.length > 0 && (
                          <div className="flex space-x-1">
                            {message.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {message.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{message.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Ações Rápidas */}
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {message.status === 'PENDING' && (
                          <>
                            <GuidedTooltip content="Marcar como respondida">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickAction(message.id, 'respond', { status: 'RESPONDED' });
                                }}
                                disabled={actionLoading === message.id}
                              >
                                {actionLoading === message.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3 w-3" />
                                )}
                              </Button>
                            </GuidedTooltip>

                            <GuidedTooltip content="Marcar como em atendimento">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickAction(message.id, 'progress', { status: 'IN_PROGRESS' });
                                }}
                                disabled={actionLoading === message.id}
                              >
                                <Clock className="h-3 w-3" />
                              </Button>
                            </GuidedTooltip>
                          </>
                        )}

                        <GuidedTooltip content="Ver detalhes e responder">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMessage(message);
                            }}
                          >
                            <Reply className="h-3 w-3" />
                          </Button>
                        </GuidedTooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal de Detalhes da Mensagem */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-100 text-green-600">
                  {selectedMessage ? getInitials(selectedMessage.contactName) : ''}
                </AvatarFallback>
              </Avatar>
              <span>{selectedMessage?.contactName}</span>
              <Badge className={selectedMessage ? getStatusColor(selectedMessage.status) : ''}>
                {selectedMessage ? getStatusLabel(selectedMessage.status) : ''}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              {/* Conteúdo da Mensagem */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">{selectedMessage.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDistanceToNow(new Date(selectedMessage.timestamp), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </p>
              </div>

              {/* Tags */}
              {selectedMessage.tags && selectedMessage.tags.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Etiquetas:</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedMessage.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex justify-between pt-4 border-t">
                <div className="flex space-x-2">
                  {selectedMessage.status === 'PENDING' && (
                    <>
                      <Button
                        onClick={() => {
                          handleQuickAction(selectedMessage.id, 'progress', { status: 'IN_PROGRESS' });
                          setSelectedMessage(null);
                        }}
                        disabled={actionLoading === selectedMessage.id}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Iniciar Atendimento
                      </Button>
                      <Button
                        onClick={() => {
                          handleQuickAction(selectedMessage.id, 'respond', { status: 'RESPONDED' });
                          setSelectedMessage(null);
                        }}
                        disabled={actionLoading === selectedMessage.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Marcar como Respondida
                      </Button>
                    </>
                  )}
                  
                  {selectedMessage.status === 'IN_PROGRESS' && (
                    <Button
                      onClick={() => {
                        handleQuickAction(selectedMessage.id, 'respond', { status: 'RESPONDED' });
                        setSelectedMessage(null);
                      }}
                      disabled={actionLoading === selectedMessage.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Finalizar Atendimento
                    </Button>
                  )}
                </div>

                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
