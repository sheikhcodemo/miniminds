import { useState } from 'react';
import {
  ChevronDown,
  Zap,
  Moon,
  Sun,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/stores/settingsStore';
import { useChatStore } from '@/stores/chatStore';
import type { AIProvider } from '@/lib/types';

interface HeaderProps {
  onOpenSettings: () => void;
  viewMode?: 'chat' | 'workspace';
  onViewModeChange?: (mode: 'chat' | 'workspace') => void;
}

export function Header({ onOpenSettings, viewMode, onViewModeChange }: HeaderProps) {
  const [providerOpen, setProviderOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);

  const {
    theme,
    setTheme,
    providers,
    defaultProvider,
    defaultModel,
    setDefaultProvider,
    setDefaultModel,
    getEnabledProviders,
  } = useSettingsStore();

  const { currentMode } = useChatStore();

  const enabledProviders = getEnabledProviders();
  const currentProvider = providers[defaultProvider];
  const availableModels = currentProvider?.models || [];

  const handleProviderChange = (providerId: AIProvider) => {
    setDefaultProvider(providerId);
    const provider = providers[providerId];
    if (provider && !provider.models.includes(defaultModel)) {
      setDefaultModel(provider.defaultModel);
    }
    setProviderOpen(false);
  };

  const handleModelChange = (model: string) => {
    setDefaultModel(model);
    setModelOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const modeNames: Record<string, string> = {
    chat: 'Chat',
    code: 'Code Generation',
    ppt: 'Presentation',
    research: 'Deep Research',
    multimodal: 'Multimodal',
  };

  return (
    <header className="h-14 px-4 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur">
      {/* Left: Current Mode */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-medium text-muted-foreground">
          {modeNames[currentMode] || 'Chat'}
        </h1>
      </div>

      {/* Center: Provider & Model Selectors */}
      <div className="flex items-center gap-2">
        {/* Provider Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setProviderOpen(!providerOpen);
              setModelOpen(false);
            }}
            disabled={enabledProviders.length === 0}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
              'bg-secondary hover:bg-secondary/80 transition-colors',
              enabledProviders.length === 0 && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span>{currentProvider?.name || 'Select Provider'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {providerOpen && enabledProviders.length > 0 && (
            <div className="absolute top-full mt-1 left-0 z-50 min-w-[160px] p-1 rounded-lg border bg-popover shadow-lg">
              {enabledProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleProviderChange(provider.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left',
                    'hover:bg-secondary transition-colors',
                    defaultProvider === provider.id && 'bg-primary/10 text-primary'
                  )}
                >
                  <Zap className="w-3.5 h-3.5" />
                  {provider.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Model Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setModelOpen(!modelOpen);
              setProviderOpen(false);
            }}
            disabled={availableModels.length === 0}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
              'bg-secondary hover:bg-secondary/80 transition-colors',
              availableModels.length === 0 && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span className="max-w-[200px] truncate">
              {defaultModel || 'Select Model'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {modelOpen && availableModels.length > 0 && (
            <div className="absolute top-full mt-1 left-0 z-50 min-w-[240px] max-h-[300px] overflow-y-auto p-1 rounded-lg border bg-popover shadow-lg">
              {availableModels.map((model) => (
                <button
                  key={model}
                  onClick={() => handleModelChange(model)}
                  className={cn(
                    'w-full px-3 py-2 rounded-md text-sm text-left',
                    'hover:bg-secondary transition-colors',
                    defaultModel === model && 'bg-primary/10 text-primary'
                  )}
                >
                  {model}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Theme & User */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <User className="w-4 h-4" />
        </button>
      </div>

      {/* Click outside to close dropdowns */}
      {(providerOpen || modelOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setProviderOpen(false);
            setModelOpen(false);
          }}
        />
      )}
    </header>
  );
}
