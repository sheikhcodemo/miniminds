import { useState } from 'react';
import { ChevronDown, ChevronRight, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSandboxStore } from '@/stores/sandboxStore';

interface ProcessStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  duration?: number;
}

export function CurrentProcess() {
  const [expanded, setExpanded] = useState(true);
  const { currentExecution } = useSandboxStore();

  // Demo steps
  const steps: ProcessStep[] = currentExecution
    ? [
        { id: '1', name: 'Parsing code', status: 'completed', duration: 120 },
        { id: '2', name: 'Executing in sandbox', status: currentExecution.status === 'running' ? 'running' : 'completed', duration: 500 },
        { id: '3', name: 'Processing output', status: currentExecution.status === 'completed' ? 'completed' : 'pending' },
      ]
    : [];

  const statusIcons = {
    pending: <Clock className="w-4 h-4 text-muted-foreground" />,
    running: <Loader2 className="w-4 h-4 text-primary animate-spin" />,
    completed: <CheckCircle className="w-4 h-4 text-green-500" />,
    error: <XCircle className="w-4 h-4 text-destructive" />,
  };

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
      >
        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        Current Process
        {currentExecution?.status === 'running' && (
          <Loader2 className="w-4 h-4 ml-auto text-primary animate-spin" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          {steps.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active process</p>
          ) : (
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                  {/* Connector line */}
                  {index > 0 && (
                    <div className="absolute -mt-6 ml-[7px] w-0.5 h-4 bg-border" />
                  )}
                  {statusIcons[step.status]}
                  <span
                    className={cn(
                      'text-sm',
                      step.status === 'pending' && 'text-muted-foreground',
                      step.status === 'running' && 'text-primary font-medium',
                      step.status === 'completed' && 'text-foreground',
                      step.status === 'error' && 'text-destructive'
                    )}
                  >
                    {step.name}
                  </span>
                  {step.duration && step.status === 'completed' && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      {step.duration}ms
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
