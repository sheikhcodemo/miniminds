import React from 'react';
import { Plus, X, MessageSquare, Code, Eye, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WindowPanelProps {
  windows: string[];
  activeWindow: string;
  onWindowChange: (window: string) => void;
  onAddWindow: (type: string) => void;
  onCloseWindow: (window: string) => void;
  children: React.ReactNode;
}

const windowIcons: Record<string, React.ReactNode> = {
  chat: <MessageSquare className="w-4 h-4" />,
  code: <Code className="w-4 h-4" />,
  preview: <Eye className="w-4 h-4" />,
  terminal: <Terminal className="w-4 h-4" />,
};

const windowLabels: Record<string, string> = {
  chat: 'Chat',
  code: 'Code',
  preview: 'Preview',
  terminal: 'Terminal',
};

export function WindowPanel({
  windows,
  activeWindow,
  onWindowChange,
  onAddWindow,
  onCloseWindow,
  children,
}: WindowPanelProps) {
  const availableWindows = ['chat', 'code', 'preview', 'terminal'].filter(
    (w) => !windows.includes(w)
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="h-10 flex items-center gap-1 px-2 border-b border-border bg-muted/30">
        {windows.map((window) => (
          <button
            key={window}
            onClick={() => onWindowChange(window)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              activeWindow === window
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            )}
          >
            {windowIcons[window]}
            {windowLabels[window]}
            {windows.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseWindow(window);
                }}
                className="ml-1 p-0.5 rounded hover:bg-muted"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </button>
        ))}

        {availableWindows.length > 0 && (
          <div className="relative group">
            <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/50">
              <Plus className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-1 py-1 rounded-lg border bg-popover shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              {availableWindows.map((window) => (
                <button
                  key={window}
                  onClick={() => onAddWindow(window)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-secondary"
                >
                  {windowIcons[window]}
                  {windowLabels[window]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
