import { useState } from 'react';
import { WindowPanel } from './WindowPanel';
import { CurrentProcess } from './CurrentProcess';
import { FilesPanel } from './FilesPanel';
import { OngoingTasks } from './OngoingTasks';
import { ChatInterface } from '../chat/ChatInterface';

export function WorkspaceLayout() {
  const [windows, setWindows] = useState<string[]>(['chat']);
  const [activeWindow, setActiveWindow] = useState('chat');

  const addWindow = (type: string) => {
    if (!windows.includes(type)) {
      setWindows([...windows, type]);
    }
    setActiveWindow(type);
  };

  const closeWindow = (type: string) => {
    const newWindows = windows.filter((w) => w !== type);
    setWindows(newWindows);
    if (activeWindow === type && newWindows.length > 0) {
      setActiveWindow(newWindows[0]);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main Window Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <WindowPanel
          windows={windows}
          activeWindow={activeWindow}
          onWindowChange={setActiveWindow}
          onAddWindow={addWindow}
          onCloseWindow={closeWindow}
        >
          {activeWindow === 'chat' && <ChatInterface />}
          {activeWindow === 'code' && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Code Editor - Coming Soon
            </div>
          )}
          {activeWindow === 'preview' && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Preview Panel - Coming Soon
            </div>
          )}
          {activeWindow === 'terminal' && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Terminal - Coming Soon
            </div>
          )}
        </WindowPanel>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-border flex flex-col bg-background overflow-hidden">
        <CurrentProcess />
        <FilesPanel />
        <OngoingTasks />
      </div>
    </div>
  );
}
