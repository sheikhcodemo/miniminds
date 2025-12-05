import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AIProvider, ProviderConfig, MCPServer, ProjectSettings } from '@/lib/types';
import { DEFAULT_PROVIDERS, PREBUILT_MCP_SERVERS } from '@/lib/types';

interface SettingsState extends ProjectSettings {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  updateProvider: (id: AIProvider, config: Partial<ProviderConfig>) => void;
  setDefaultProvider: (provider: AIProvider) => void;
  setDefaultModel: (model: string) => void;
  setE2BConfig: (config: Partial<ProjectSettings['e2b']>) => void;
  updateSupabase: (config: Partial<ProjectSettings['supabase']>) => void;
  addMCPServer: (server: MCPServer) => void;
  updateMCPServer: (id: string, config: Partial<MCPServer>) => void;
  removeMCPServer: (id: string) => void;
  toggleMCPServer: (id: string) => void;
  setEnvVar: (key: string, value: string) => void;
  removeEnvVar: (key: string) => void;
  getActiveProvider: () => ProviderConfig | null;
  getEnabledProviders: () => ProviderConfig[];
  getAllEnvVars: () => Record<string, string>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      providers: DEFAULT_PROVIDERS,
      defaultProvider: 'groq',
      defaultModel: 'llama-3.3-70b-versatile',
      e2b: {
        apiKey: '',
        template: 'code-interpreter-stateful',
        timeout: 300000,
      },
      supabase: {
        url: '',
        anonKey: '',
        serviceKey: '',
        enabled: false,
      },
      mcpServers: PREBUILT_MCP_SERVERS.map(s => ({ ...s, connected: false })),
      envVars: {},

      setTheme: (theme) => set({ theme }),

      updateProvider: (id, config) =>
        set((state) => ({
          providers: {
            ...state.providers,
            [id]: { ...state.providers[id], ...config },
          },
        })),

      setDefaultProvider: (provider) => set({ defaultProvider: provider }),

      setDefaultModel: (model) => set({ defaultModel: model }),

      setE2BConfig: (config) =>
        set((state) => ({ e2b: { ...state.e2b, ...config } })),

      updateSupabase: (config) =>
        set((state) => ({ supabase: { ...state.supabase, ...config } })),

      addMCPServer: (server) =>
        set((state) => ({ mcpServers: [...state.mcpServers, server] })),

      updateMCPServer: (id, config) =>
        set((state) => ({
          mcpServers: state.mcpServers.map((s) =>
            s.id === id ? { ...s, ...config } : s
          ),
        })),

      removeMCPServer: (id) =>
        set((state) => ({
          mcpServers: state.mcpServers.filter((s) => s.id !== id),
        })),

      toggleMCPServer: (id) =>
        set((state) => ({
          mcpServers: state.mcpServers.map((s) =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
          ),
        })),

      setEnvVar: (key, value) =>
        set((state) => ({ envVars: { ...state.envVars, [key]: value } })),

      removeEnvVar: (key) =>
        set((state) => {
          const { [key]: _, ...rest } = state.envVars;
          return { envVars: rest };
        }),

      getActiveProvider: () => {
        const state = get();
        const provider = state.providers[state.defaultProvider];
        if (provider?.enabled && provider?.apiKey) return provider;

        const enabled = Object.values(state.providers).find(
          (p) => p.enabled && p.apiKey
        );
        return enabled || null;
      },

      getEnabledProviders: () => {
        const state = get();
        return Object.values(state.providers).filter((p) => p.enabled && p.apiKey);
      },

      getAllEnvVars: () => {
        const state = get();
        const vars: Record<string, string> = { ...state.envVars };

        Object.values(state.providers).forEach((p) => {
          if (p.apiKey) {
            vars[`${p.id.toUpperCase()}_API_KEY`] = p.apiKey;
          }
        });

        if (state.e2b.apiKey) vars['E2B_API_KEY'] = state.e2b.apiKey;

        if (state.supabase.enabled) {
          if (state.supabase.url) vars['SUPABASE_URL'] = state.supabase.url;
          if (state.supabase.anonKey) vars['SUPABASE_ANON_KEY'] = state.supabase.anonKey;
          if (state.supabase.serviceKey) vars['SUPABASE_SERVICE_KEY'] = state.supabase.serviceKey;
        }

        state.mcpServers.forEach((mcp) => {
          if (mcp.enabled) {
            Object.entries(mcp.config).forEach(([key, value]) => {
              if (value) vars[key] = value;
            });
          }
        });

        return vars;
      },
    }),
    {
      name: 'miniminds-settings',
    }
  )
);
