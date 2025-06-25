
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  Settings, 
  Tag, 
  Layout, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Smartphone,
  Shield,
  Sparkles,
  Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OnboardingWizardProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
}

const steps = [
  {
    id: 1,
    title: "Bem-vindo ao seu Organizador de WhatsApp! 🎉",
    description: "Vamos te ajudar a configurar tudo em poucos minutos",
    icon: Heart,
    content: "welcome"
  },
  {
    id: 2,
    title: "Conecte seu WhatsApp 📱",
    description: "Configure sua conta para receber mensagens",
    icon: Smartphone,
    content: "whatsapp-setup"
  },
  {
    id: 3,
    title: "Crie suas Etiquetas 🏷️",
    description: "Organize suas conversas por temas",
    icon: Tag,
    content: "create-tags"
  },
  {
    id: 4,
    title: "Conheça sua Central de Mensagens 💬",
    description: "Veja como gerenciar suas conversas",
    icon: Layout,
    content: "dashboard-tour"
  },
  {
    id: 5,
    title: "Tudo Pronto! ✨",
    description: "Você já pode começar a usar",
    icon: CheckCircle,
    content: "completion"
  }
];

export default function OnboardingWizard({ isOpen, onComplete, onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [sampleTags, setSampleTags] = useState(['Vendas', 'Suporte', 'Dúvidas']);
  const [whatsappConfig, setWhatsappConfig] = useState({
    phoneNumber: '',
    businessName: ''
  });

  const currentStepData = steps.find(step => step.id === currentStep);
  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStepData?.content) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-br from-green-100 to-blue-100 p-8 rounded-2xl">
              <MessageSquare className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Organize suas mensagens como um profissional!
              </h3>
              <p className="text-gray-600">
                Nunca mais perca uma conversa importante. Vamos te mostrar como funciona!
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium">Seguro</p>
                <p className="text-xs text-gray-500">Seus dados protegidos</p>
              </div>
              <div className="space-y-2">
                <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium">Inteligente</p>
                <p className="text-xs text-gray-500">Organização automática</p>
              </div>
              <div className="space-y-2">
                <div className="bg-green-100 p-3 rounded-full w-fit mx-auto">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium">Fácil</p>
                <p className="text-xs text-gray-500">Interface simples</p>
              </div>
            </div>
          </div>
        );

      case 'whatsapp-setup':
        return (
          <div className="space-y-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Configure seu WhatsApp Business
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Nome do seu negócio</Label>
                  <Input
                    id="businessName"
                    placeholder="Ex: Minha Loja"
                    value={whatsappConfig.businessName}
                    onChange={(e) => setWhatsappConfig(prev => ({
                      ...prev,
                      businessName: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Número do WhatsApp Business</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Ex: (11) 99999-9999"
                    value={whatsappConfig.phoneNumber}
                    onChange={(e) => setWhatsappConfig(prev => ({
                      ...prev,
                      phoneNumber: e.target.value
                    }))}
                  />
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    💡 <strong>Dica:</strong> Por enquanto, você pode pular esta etapa e usar o modo demonstração para aprender como funciona!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'create-tags':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Tag className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Crie suas primeiras etiquetas</h3>
              <p className="text-gray-600">Etiquetas ajudam a organizar suas mensagens por assunto</p>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <Label>Suas etiquetas (clique para editar)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sampleTags.map((tag, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-green-100"
                      onClick={() => {
                        const newTag = prompt('Editar etiqueta:', tag);
                        if (newTag && newTag.trim()) {
                          const newTags = [...sampleTags];
                          newTags[index] = newTag.trim();
                          setSampleTags(newTags);
                        }
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer border-dashed"
                    onClick={() => {
                      const newTag = prompt('Nova etiqueta:');
                      if (newTag && newTag.trim()) {
                        setSampleTags(prev => [...prev, newTag.trim()]);
                      }
                    }}
                  >
                    + Adicionar
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Exemplos: Vendas, Suporte, Orçamentos, Dúvidas, Clientes VIP
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'dashboard-tour':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Layout className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sua Central de Mensagens</h3>
              <p className="text-gray-600">Veja como é fácil gerenciar suas conversas</p>
            </div>

            <div className="space-y-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500 p-2 rounded-full">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">1. Veja suas mensagens</p>
                      <p className="text-sm text-gray-600">Todas as conversas organizadas em um só lugar</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 p-2 rounded-full">
                      <Tag className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">2. Organize com etiquetas</p>
                      <p className="text-sm text-gray-600">Clique para adicionar etiquetas às mensagens</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-500 p-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">3. Marque como respondida</p>
                      <p className="text-sm text-gray-600">Para saber quais já foram atendidas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'completion':
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-br from-green-100 to-blue-100 p-8 rounded-2xl">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Parabéns! Tudo configurado! 🎉
              </h3>
              <p className="text-gray-600">
                Agora você já pode começar a organizar suas mensagens de WhatsApp
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Sistema configurado</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Etiquetas criadas</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Interface conhecida</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Lembre-se:</strong> Você pode acessar a ajuda a qualquer momento clicando no botão "?" no canto superior direito!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-3">
              {currentStepData && (
                <div className="bg-green-100 p-2 rounded-lg">
                  <currentStepData.icon className="h-5 w-5 text-green-600" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{currentStepData?.title}</h2>
                <p className="text-sm text-gray-600 font-normal">{currentStepData?.description}</p>
              </div>
            </DialogTitle>
            <Badge variant="outline">
              {currentStep} de {steps.length}
            </Badge>
          </div>
        </DialogHeader>

        {/* Barra de Progresso */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Conteúdo da Etapa */}
        <div className="min-h-[300px]">
          {renderStepContent()}
        </div>

        {/* Botões de Navegação */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
            {currentStep === steps.length ? (
              <>
                Começar a usar
                <CheckCircle className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
