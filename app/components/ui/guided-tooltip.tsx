
'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { ReactNode } from 'react';

interface GuidedTooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  showIcon?: boolean;
  iconPosition?: 'before' | 'after';
}

export default function GuidedTooltip({ 
  content, 
  children, 
  side = 'top',
  showIcon = false,
  iconPosition = 'after'
}: GuidedTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-1">
            {showIcon && iconPosition === 'before' && (
              <HelpCircle className="h-4 w-4 text-gray-400" />
            )}
            {children}
            {showIcon && iconPosition === 'after' && (
              <HelpCircle className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
