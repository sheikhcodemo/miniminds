import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { useSettingsStore } from '@/stores/settingsStore';
import { useChatStore } from '@/stores/chatStore';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'chat' | 'workspace'>('chat');
  const { theme } = useSettingsStore();
  const { currentMode } = useChatStore();

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Check for first-time setup
  useEffect(() => {
    const { getActiveProvider } = useSettingsStore.getState();
    if (!getActiveProvider()) {
      // Show settings on first load if no provider configured
      const timer = setTimeout(() => setSettingsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Switch to workspace view for code mode
  useEffect(() => {
    if (currentMode === 'code') {
      setViewMode('workspace');
    }
  }, [currentMode]);

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        onOpenSettings={() => setSettingsOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onOpenSettings={() => setSettingsOpen(true)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {viewMode === 'chat' ? (
          <ChatInterface />
        ) : (
          <WorkspaceLayout />
        )}
      </div>

      {/* Settings Modal */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
