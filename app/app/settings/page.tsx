
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, MessageSquare, Smartphone, Globe, Clock, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    alertTimeMinutes: 30,
    enablePushNotifications: true,
    enableEmailNotifications: false,
    workingHoursStart: "09:00",
    workingHoursEnd: "18:00",
    autoTagging: true,
    aiSuggestions: true,
    theme: "light",
    language: "pt"
  });
  
  const [loading, setLoading] = useState(false);

  // Carregar configurações
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast({
          title: "Configurações salvas!",
          description: "Suas preferências foram atualizadas com sucesso.",
        });
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header da Página */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Dashboard</span>
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <SettingsIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
              <p className="text-gray-600">Personalize seu organizador de WhatsApp</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle>Notificações e Alertas</CardTitle>
              <CardDescription>
                Configure como você quer ser notificado sobre mensagens pendentes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificações Push</Label>
                  <div className="text-sm text-muted-foreground">
                    Receba alertas no navegador
                  </div>
                </div>
                <Switch
                  checked={settings.enablePushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('enablePushNotifications', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertTime">Tempo para alerta (minutos)</Label>
                <Select 
                  value={settings.alertTimeMinutes.toString()} 
                  onValueChange={(value) => handleSettingChange('alertTimeMinutes', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                    <SelectItem value="240">4 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Horário de Funcionamento */}
          <Card>
            <CardHeader>
              <CardTitle>Horário de Funcionamento</CardTitle>
              <CardDescription>
                Define quando você está disponível para responder mensagens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workingStart">Início</Label>
                  <Input
                    id="workingStart"
                    type="time"
                    value={settings.workingHoursStart}
                    onChange={(e) => handleSettingChange('workingHoursStart', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingEnd">Fim</Label>
                  <Input
                    id="workingEnd"
                    type="time"
                    value={settings.workingHoursEnd}
                    onChange={(e) => handleSettingChange('workingHoursEnd', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Automação e IA */}
          <Card>
            <CardHeader>
              <CardTitle>Automação e Inteligência Artificial</CardTitle>
              <CardDescription>
                Configure recursos automáticos e sugestões inteligentes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Classificação Automática</Label>
                  <div className="text-sm text-muted-foreground">
                    Classifica mensagens automaticamente por categoria e prioridade
                  </div>
                </div>
                <Switch
                  checked={settings.autoTagging}
                  onCheckedChange={(checked) => handleSettingChange('autoTagging', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Sugestões de IA</Label>
                  <div className="text-sm text-muted-foreground">
                    Receba sugestões de respostas geradas por inteligência artificial
                  </div>
                </div>
                <Switch
                  checked={settings.aiSuggestions}
                  onCheckedChange={(checked) => handleSettingChange('aiSuggestions', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Aparência */}
          <Card>
            <CardHeader>
              <CardTitle>Aparência e Idioma</CardTitle>
              <CardDescription>
                Personalize a aparência e idioma da interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value) => handleSettingChange('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select 
                    value={settings.language} 
                    onValueChange={(value) => handleSettingChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guia de Configuração do WhatsApp */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Configuração do WhatsApp Business</span>
              </CardTitle>
              <CardDescription>
                Aprenda a conectar seu WhatsApp Business com este organizador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="step1">
                  <AccordionTrigger>1. Configurar WhatsApp Business</AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p>Primeiro, você precisa ter o WhatsApp Business instalado:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      <li>Baixe o WhatsApp Business na App Store ou Google Play</li>
                      <li>Configure sua conta comercial</li>
                      <li>Adicione informações do seu negócio</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step2">
                  <AccordionTrigger>2. Organizar Conversas</AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p>Para melhor organização:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      <li>Use etiquetas no WhatsApp Business para categorizar conversas</li>
                      <li>Configure mensagens automáticas de saudação</li>
                      <li>Crie atalhos para respostas frequentes</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step3">
                  <AccordionTrigger>3. Integração com este Sistema</AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p>Este organizador funciona como complemento:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      <li>Adicione manualmente as conversas importantes aqui</li>
                      <li>Use o sistema para rastrear status de respostas</li>
                      <li>Aproveite a IA para sugestões de respostas</li>
                      <li>Monitore métricas de atendimento</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Botão Salvar */}
          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
