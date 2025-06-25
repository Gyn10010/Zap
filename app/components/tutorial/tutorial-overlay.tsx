
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  MessageSquare, 
  Filter, 
  Settings, 
  Tags,
  Grid3X3,
  BarChart3
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Tutorial! 👋',
    description: 'Vamos mostrar como usar sua central de mensagens. Este tutorial leva apenas 2 minutos!',
    target: 'body',
    position: 'bottom'
  },
  {
    id: 'messages-list',
    title: 'Lista de Mensagens 💬',
    description: 'Aqui ficam todas as suas conversas. Clique em qualquer mensagem para ver os detalhes e responder.',
    target: '[data-tutorial="messages-list"]',
    position: 'right'
  },
  {
    id: 'filters',
    title: 'Filtros Inteligentes 🔍',
    description: 'Use os filtros para encontrar mensagens específicas. Filtre por status, prioridade ou etiquetas.',
    target: '[data-tutorial="filters"]',
    position: 'bottom'
  },
  {
    id: 'stats',
    title: 'Resumo das Mensagens 📊',
    description: 'Veja estatísticas rápidas: total de mensagens, pendentes, respondidas e urgentes.',
    target: '[data-tutorial="stats"]',
    position: 'bottom'
  },
  {
    id: 'view-toggle',
    title: 'Modos de Visualização 👁️',
    description: 'Alterne entre visualização em lista ou quadro Kanban para organizar suas mensagens.',
    target: '[data-tutorial="view-toggle"]',
    position: 'left'
  },
  {
    id: 'quick-actions',
    title: 'Ações Rápidas ⚡',
    description: 'Acesse rapidamente configurações, ajuda e outras ferramentas úteis.',
    target: '[data-tutorial="quick-actions"]',
    position: 'left'
  }
];

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TutorialOverlay({ isOpen, onClose }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightElement, setHighlightElement] = useState<HTMLElement | null>(null);

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  useEffect(() => {
    if (isOpen && currentStepData) {
      const element = document.querySelector(currentStepData.target) as HTMLElement;
      setHighlightElement(element);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isOpen, currentStepData]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay escuro */}
      <div className="fixed inset-0 z-40 bg-black/50" />
      
      {/* Destacar elemento atual */}
      {highlightElement && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: highlightElement.offsetTop - 4,
            left: highlightElement.offsetLeft - 4,
            width: highlightElement.offsetWidth + 8,
            height: highlightElement.offsetHeight + 8,
          }}
        >
          <div className="w-full h-full border-2 border-green-500 rounded-lg bg-green-500/10 animate-pulse" />
        </div>
      )}

      {/* Modal do Tutorial */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md z-50">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center space-x-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </div>
                <span>Tutorial Interativo</span>
              </DialogTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {currentStep + 1} de {tutorialSteps.length}
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Barra de Progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Conteúdo da Etapa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentStepData?.title}</h3>
            <p className="text-gray-600">{currentStepData?.description}</p>
            
            {currentStep === 0 && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>Dica:</strong> Este tutorial é interativo! Siga as áreas destacadas na tela.
                </p>
              </div>
            )}
          </div>

          {/* Botões de Navegação */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
              {currentStep === tutorialSteps.length - 1 ? (
                <>
                  Finalizar
                  <X className="ml-2 h-4 w-4" />
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
    </>
  );
}
