
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/dashboard/header';
import WhatsAppSimulator from '@/components/simulator/whatsapp-simulator';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SimulatorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
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

        {/* Simulador */}
        <WhatsAppSimulator />
      </div>
    </div>
  );
}
