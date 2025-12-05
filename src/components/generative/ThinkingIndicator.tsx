import React from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThinkingIndicatorProps {
  stage?: string;
  details?: string;
  className?: string;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  stage = 'Thinking',
  details,
  className,
}) => {
  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-lg bg-muted/50', className)}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Brain className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="font-medium text-sm">{stage}...</span>
        </div>
        {details && (
          <p className="mt-1 text-sm text-muted-foreground">{details}</p>
        )}
        <div className="flex gap-1 mt-2">
          <div className="typing-dot w-2 h-2 rounded-full bg-primary" />
          <div className="typing-dot w-2 h-2 rounded-full bg-primary" />
          <div className="typing-dot w-2 h-2 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
};

export default ThinkingIndicator;
