import { useState } from 'react';
import {
  MessageCircle,
  Code,
  Presentation,
  Search,
  Layers,
  Plus,
  Settings,
  Trash2,
  ChevronDown,
  ChevronRight,
  Puzzle,
  History,
  LayoutGrid,
  MessagesSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chatStore';
import { useSettingsStore } from '@/stores/settingsStore';
import type { FeatureMode } from '@/lib/types';

const modeIcons: Record<FeatureMode, React.ReactNode> = {
  chat: <MessageCircle className="w-4 h-4" />,
  code: <Code className="w-4 h-4" />,
  ppt: <Presentation className="w-4 h-4" />,
  research: <Search className="w-4 h-4" />,
  multimodal: <Layers className="w-4 h-4" />,
};

const modeLabels: Record<FeatureMode, string> = {
  chat: 'Chat',
  code: 'Code',
  ppt: 'PPT',
  research: 'Research',
  multimodal: 'Multimodal',
};

interface SidebarProps {
  onOpenSettings: () => void;
  viewMode?: 'chat' | 'workspace';
  onViewModeChange?: (mode: 'chat' | 'workspace') => void;
}

export function Sidebar({ onOpenSettings, viewMode = 'chat', onViewModeChange }: SidebarProps) {
  const [historyOpen, setHistoryOpen] = useState(true);
  const [mcpOpen, setMcpOpen] = useState(false);

  const { chats, activeChat, setActiveChat, createChat, deleteChat, currentMode, setCurrentMode } = useChatStore();
  const { defaultProvider, defaultModel, mcpServers } = useSettingsStore();

  const handleNewChat = () => {
    createChat(currentMode, defaultProvider, defaultModel);
  };

  const enabledMCPs = mcpServers.filter(m => m.enabled);

  return (
    <aside className="w-64 h-full flex flex-col bg-sidebar-background border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-semibold text-lg gradient-text">MiniMinds</span>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">New Chat</span>
        </button>
      </div>

      {/* Mode Selector */}
      <div className="px-3 pb-3">
        <div className="flex flex-wrap gap-1">
          {(Object.keys(modeIcons) as FeatureMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setCurrentMode(mode)}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors',
                currentMode === mode
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
              )}
            >
              {modeIcons[mode]}
              {modeLabels[mode]}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Chat History */}
        <div className="px-3 py-2">
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {historyOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <History className="w-4 h-4" />
            History
          </button>

          {historyOpen && (
            <div className="mt-1 space-y-0.5">
              {chats.length === 0 ? (
                <p className="px-2 py-2 text-xs text-muted-foreground">No chats yet</p>
              ) : (
                chats.slice(0, 20).map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      'group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer',
                      activeChat === chat.id
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-sidebar-accent'
                    )}
                    onClick={() => setActiveChat(chat.id)}
                  >
                    {modeIcons[chat.mode]}
                    <span className="flex-1 text-sm truncate">{chat.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* MCP Servers */}
        <div className="px-3 py-2 border-t border-sidebar-border">
          <button
            onClick={() => setMcpOpen(!mcpOpen)}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {mcpOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <Puzzle className="w-4 h-4" />
            MCP Servers
            {enabledMCPs.length > 0 && (
              <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                {enabledMCPs.length}
              </span>
            )}
          </button>

          {mcpOpen && (
            <div className="mt-1 space-y-0.5">
              {enabledMCPs.length === 0 ? (
                <p className="px-2 py-2 text-xs text-muted-foreground">No MCPs enabled</p>
              ) : (
                enabledMCPs.map((mcp) => (
                  <div
                    key={mcp.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm"
                  >
                    <span className={cn('status-dot', mcp.connected ? 'connected' : 'disconnected')} />
                    <span className="truncate">{mcp.name}</span>
                  </div>
                ))
              )}
              <button
                onClick={onOpenSettings}
                className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-3 h-3" />
                Add MCP
              </button>
            </div>
          )}
        </div>
      </div>

      {/* View Mode Toggle */}
      {onViewModeChange && (
        <div className="px-3 py-2 border-t border-sidebar-border">
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => onViewModeChange('chat')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                viewMode === 'chat'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <MessagesSquare className="w-4 h-4" />
              Chat
            </button>
            <button
              onClick={() => onViewModeChange('workspace')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                viewMode === 'workspace'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              Workspace
            </button>
          </div>
        </div>
      )}

      {/* Settings Button */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={onOpenSettings}
          className="sidebar-item w-full"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
