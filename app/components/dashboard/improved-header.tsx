
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import GuidedTooltip from '@/components/ui/guided-tooltip';
import { 
  MessageSquare, 
  Settings, 
  HelpCircle, 
  User,
  PlayCircle,
  BookOpen,
  Sparkles,
  BarChart3
} from 'lucide-react';

interface ImprovedHeaderProps {
  onStartTutorial?: () => void;
}

export default function ImprovedHeader({ onStartTutorial }: ImprovedHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Título */}
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Organizador de WhatsApp
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                Sistema pessoal de organização
              </p>
            </div>
          </div>

          {/* Ações do Header */}
          <div className="flex items-center space-x-4">
            {/* Botão Tutorial */}
            {onStartTutorial && (
              <GuidedTooltip content="Inicie o tutorial interativo para aprender a usar o sistema">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onStartTutorial}
                >
                  <PlayCircle className="h-4 w-4" />
                  <span className="hidden sm:ml-2 sm:inline">Tutorial</span>
                </Button>
              </GuidedTooltip>
            )}

            {/* Botão Ajuda */}
            <GuidedTooltip content="Acesse a central de ajuda com documentação completa">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/help')}
              >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:ml-2 sm:inline">Ajuda</span>
              </Button>
            </GuidedTooltip>

            {/* Menu de Opções */}
            <DropdownMenu>
              <GuidedTooltip content="Acesse configurações, ajuda e outras opções">
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-100 text-green-600">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
              </GuidedTooltip>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Organizador de WhatsApp
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Sistema Pessoal
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Mensagens</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => router.push('/help')}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Central de Ajuda</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push('/simulator')}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>Simulador</span>
                </DropdownMenuItem>

                {onStartTutorial && (
                  <DropdownMenuItem onClick={onStartTutorial}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    <span>Tutorial Interativo</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
