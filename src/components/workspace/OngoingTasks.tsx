import { useState } from 'react';
import { ChevronDown, ChevronRight, Loader2, CheckCircle, XCircle, Pause, Play, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'completed' | 'error';
  progress?: number;
}

export function OngoingTasks() {
  const [expanded, setExpanded] = useState(true);

  // Demo tasks
  const tasks: Task[] = [
    { id: '1', name: 'Installing dependencies', status: 'completed' },
    { id: '2', name: 'Building project', status: 'running', progress: 65 },
  ];

  const statusIcons = {
    running: <Loader2 className="w-4 h-4 text-primary animate-spin" />,
    paused: <Pause className="w-4 h-4 text-yellow-500" />,
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
        Ongoing Tasks
        {tasks.filter((t) => t.status === 'running').length > 0 && (
          <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
            {tasks.filter((t) => t.status === 'running').length}
          </span>
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No ongoing tasks</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    {statusIcons[task.status]}
                    <span
                      className={cn(
                        'text-sm flex-1',
                        task.status === 'completed' && 'text-muted-foreground line-through'
                      )}
                    >
                      {task.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {task.status === 'running' && (
                        <button className="p-1 rounded hover:bg-muted">
                          <Pause className="w-3 h-3 text-muted-foreground" />
                        </button>
                      )}
                      {task.status === 'paused' && (
                        <button className="p-1 rounded hover:bg-muted">
                          <Play className="w-3 h-3 text-muted-foreground" />
                        </button>
                      )}
                      <button className="p-1 rounded hover:bg-muted">
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  {task.progress !== undefined && task.status === 'running' && (
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
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
