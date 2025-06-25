
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  Tag,
  User,
  Users,
  Loader2,
  Lightbulb
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageModalProps {
  message: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (messageId: string, updates: any) => void;
}

export default function MessageModal({ message, isOpen, onClose, onUpdate }: MessageModalProps) {
  const [response, setResponse] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [sendingResponse, setSendingResponse] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && message) {
      loadSuggestions();
    }
  }, [isOpen, message]);

  const loadSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const response = await fetch('/api/messages/suggest-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message.content,
          contactName: message.contact.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Erro ao carregar sugestões:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const sendResponse = async () => {
    if (!response.trim()) return;

    try {
      setSendingResponse(true);
      
      // Simular envio da resposta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Marcar mensagem como respondida
      await onUpdate(message.id, {
        status: 'RESPONDED',
        respondedAt: new Date().toISOString(),
      });

      toast({
        title: "Resposta enviada!",
        description: "Mensagem enviada com sucesso.",
      });

      setResponse('');
      onClose();
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar resposta.",
        variant: "destructive",
      });
    } finally {
      setSendingResponse(false);
    }
  };

  const updateStatus = async (status: string) => {
    await onUpdate(message.id, { status });
    toast({
      title: "Status atualizado",
      description: `Mensagem marcada como ${status.toLowerCase()}`,
    });
  };

  const updatePriority = async (priority: string) => {
    await onUpdate(message.id, { priority });
    toast({
      title: "Prioridade atualizada",
      description: `Prioridade alterada para ${priority.toLowerCase()}`,
    });
  };

  const getContactInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'READ':
        return 'bg-blue-100 text-blue-800';
      case 'RESPONDED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Detalhes da Mensagem</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Contato */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className={`${message.contact.isGroup ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {message.contact.isGroup ? (
                      <Users className="h-6 w-6" />
                    ) : (
                      getContactInitials(message.contact.name)
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{message.contact.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Phone className="h-4 w-4" />
                    <span>{message.contact.phone}</span>
                    {message.contact.isGroup && (
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        Grupo
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(message.status)}>
                    {message.status}
                  </Badge>
                  <Badge variant="outline">
                    {message.priority}
                  </Badge>
                  <Badge variant="outline">
                    {message.category}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">
                  {format(new Date(message.timestamp), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Conteúdo da Mensagem */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">{message.content}</p>
              </div>
              
              {/* Tags */}
              {message.tags && message.tags.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {message.tags.map((tagRelation: any) => (
                      <Badge 
                        key={tagRelation.tag.id}
                        variant="outline"
                        style={{ 
                          borderColor: tagRelation.tag.color,
                          color: tagRelation.tag.color,
                        }}
                      >
                        {tagRelation.tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Controles de Status e Prioridade */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={message.status} onValueChange={updateStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span>Pendente</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="READ">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>Lida</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="RESPONDED">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Respondida</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Prioridade</label>
              <Select value={message.priority} onValueChange={updatePriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="URGENT">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span>Urgente</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sugestões de Resposta */}
          {message.status === 'PENDING' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <span>Sugestões de Resposta IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSuggestions ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Gerando sugestões...</span>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="space-y-3">
                    {suggestions.map((suggestion: any, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                           onClick={() => setResponse(suggestion.content)}>
                        <div className="flex items-center space-x-2 mb-1">
                          <Lightbulb className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium">{suggestion.title}</span>
                        </div>
                        <p className="text-sm text-gray-700">{suggestion.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Não foi possível gerar sugestões para esta mensagem.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Resposta */}
          {message.status === 'PENDING' && (
            <Card>
              <CardHeader>
                <CardTitle>Responder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Digite sua resposta..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={sendResponse}
                      disabled={!response.trim() || sendingResponse}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {sendingResponse ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Enviar Resposta
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
