import { useState } from 'react';
import {
  X,
  Key,
  Zap,
  Database,
  Puzzle,
  Terminal,
  Eye,
  EyeOff,
  Check,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/stores/settingsStore';
import type { AIProvider } from '@/lib/types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'providers' | 'e2b' | 'mcp' | 'database';

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('providers');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-background rounded-xl shadow-xl border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[60vh]">
          {/* Sidebar */}
          <div className="w-48 border-r p-2">
            <nav className="space-y-1">
              <TabButton
                active={activeTab === 'providers'}
                onClick={() => setActiveTab('providers')}
                icon={<Zap className="w-4 h-4" />}
              >
                AI Providers
              </TabButton>
              <TabButton
                active={activeTab === 'e2b'}
                onClick={() => setActiveTab('e2b')}
                icon={<Terminal className="w-4 h-4" />}
              >
                E2B Sandbox
              </TabButton>
              <TabButton
                active={activeTab === 'mcp'}
                onClick={() => setActiveTab('mcp')}
                icon={<Puzzle className="w-4 h-4" />}
              >
                MCP Servers
              </TabButton>
              <TabButton
                active={activeTab === 'database'}
                onClick={() => setActiveTab('database')}
                icon={<Database className="w-4 h-4" />}
              >
                Database
              </TabButton>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'providers' && <ProvidersTab />}
            {activeTab === 'e2b' && <E2BTab />}
            {activeTab === 'mcp' && <MCPTab />}
            {activeTab === 'database' && <DatabaseTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
  icon,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function ProvidersTab() {
  const { providers, updateProvider, defaultProvider, setDefaultProvider } = useSettingsStore();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const providerList: { id: AIProvider; name: string; url: string }[] = [
    { id: 'groq', name: 'Groq', url: 'https://console.groq.com' },
    { id: 'google', name: 'Google AI', url: 'https://aistudio.google.com' },
    { id: 'cerebras', name: 'Cerebras', url: 'https://cloud.cerebras.ai' },
    { id: 'together', name: 'Together.ai', url: 'https://together.ai' },
    { id: 'mistral', name: 'Mistral', url: 'https://mistral.ai' },
    { id: 'openai', name: 'OpenAI', url: 'https://platform.openai.com' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold mb-1">AI Providers</h3>
        <p className="text-sm text-muted-foreground">
          Configure your AI provider API keys. Keys are stored locally in your browser.
        </p>
      </div>

      <div className="space-y-4">
        {providerList.map((p) => {
          const provider = providers[p.id];
          const isDefault = defaultProvider === p.id;
          const hasKey = !!provider?.apiKey;

          return (
            <div key={p.id} className="settings-section">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{p.name}</span>
                  {isDefault && hasKey && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                  {hasKey && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  Get API Key
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showKeys[p.id] ? 'text' : 'password'}
                  value={provider?.apiKey || ''}
                  onChange={(e) =>
                    updateProvider(p.id, { apiKey: e.target.value })
                  }
                  placeholder={`Enter ${p.name} API key`}
                  className="w-full pl-10 pr-10 py-2 rounded-lg border bg-background text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys({ ...showKeys, [p.id]: !showKeys[p.id] })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKeys[p.id] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {hasKey && !isDefault && (
                <button
                  onClick={() => setDefaultProvider(p.id)}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Set as default
                </button>
              )}
            </div>
          );
        })}]
      </div>
    </div>
  );
}

function E2BTab() {
  const { e2b, setE2BConfig } = useSettingsStore();
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold mb-1">E2B Sandbox</h3>
        <p className="text-sm text-muted-foreground">
          Configure E2B for secure code execution in isolated sandboxes.
        </p>
      </div>

      <div className="settings-section">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium">API Key</span>
          <a
            href="https://e2b.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            Get API Key
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type={showKey ? 'text' : 'password'}
            value={e2b?.apiKey || ''}
            onChange={(e) => setE2BConfig({ apiKey: e.target.value })}
            placeholder="Enter E2B API key"
            className="w-full pl-10 pr-10 py-2 rounded-lg border bg-background text-sm"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted/50 text-sm">
        <p className="font-medium mb-2">Note: Backend Required</p>
        <p className="text-muted-foreground">
          E2B Code Interpreter runs server-side. To enable full code execution,
          set up a backend API that uses the @e2b/code-interpreter package.
        </p>
      </div>
    </div>
  );
}

function MCPTab() {
  const { mcpServers, toggleMCPServer, updateMCPServer } = useSettingsStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold mb-1">MCP Servers</h3>
        <p className="text-sm text-muted-foreground">
          Enable Model Context Protocol servers to extend AI capabilities.
        </p>
      </div>

      <div className="space-y-3">
        {mcpServers.map((mcp) => (
          <div key={mcp.id} className="settings-section">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{mcp.name}</span>
                <span className={cn('status-dot', mcp.connected ? 'connected' : 'disconnected')} />
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={mcp.enabled}
                  onChange={() => toggleMCPServer(mcp.id)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
            {mcp.description && (
              <p className="text-xs text-muted-foreground mb-2">{mcp.description}</p>
            )}
            {mcp.enabled && Object.keys(mcp.config).length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border">
                {Object.entries(mcp.config).map(([key, value]) => (
                  <div key={key} className="settings-field">
                    <label className="settings-label">{key}</label>
                    <input
                      type="password"
                      value={value}
                      onChange={(e) =>
                        updateMCPServer(mcp.id, {
                          config: { ...mcp.config, [key]: e.target.value },
                        })
                      }
                      placeholder={`Enter ${key}`}
                      className="w-full px-3 py-1.5 rounded border bg-background text-sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DatabaseTab() {
  const { supabase, updateSupabase } = useSettingsStore();
  const [showKeys, setShowKeys] = useState({ anon: false, service: false });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold mb-1">Supabase Database</h3>
        <p className="text-sm text-muted-foreground">
          Connect to Supabase for persistent storage (optional).
        </p>
      </div>

      <div className="settings-section">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium">Enable Supabase</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={supabase?.enabled || false}
              onChange={(e) => updateSupabase({ enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
          </label>
        </div>

        {supabase?.enabled && (
          <div className="space-y-3">
            <div className="settings-field">
              <label className="settings-label">Project URL</label>
              <input
                type="text"
                value={supabase.url || ''}
                onChange={(e) => updateSupabase({ url: e.target.value })}
                placeholder="https://xxx.supabase.co"
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">Anon Key</label>
              <div className="relative">
                <input
                  type={showKeys.anon ? 'text' : 'password'}
                  value={supabase.anonKey || ''}
                  onChange={(e) => updateSupabase({ anonKey: e.target.value })}
                  placeholder="Enter anon key"
                  className="w-full px-3 py-2 pr-10 rounded-lg border bg-background text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys({ ...showKeys, anon: !showKeys.anon })}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showKeys.anon ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
