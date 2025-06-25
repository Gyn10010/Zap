
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/dashboard/header';
import HelpCenter from '@/components/help/help-center';
import TutorialOverlay from '@/components/tutorial/tutorial-overlay';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HelpPage() {
  const router = useRouter();
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onStartTutorial={() => setShowTutorial(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Dashboard</span>
          </Button>
        </div>

        {/* Central de Ajuda */}
        <HelpCenter onStartTutorial={() => setShowTutorial(true)} />
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay 
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)} 
        />
      )}
    </div>
  );
}
