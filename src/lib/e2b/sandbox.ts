// E2B Sandbox Integration
// Note: Full E2B integration requires a backend API since E2B SDK runs server-side
// This is a client-side abstraction that would call your backend API

import { useSandboxStore } from '@/stores/sandboxStore';
import { useSettingsStore } from '@/stores/settingsStore';

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  files?: { name: string; url: string }[];
  logs: string[];
}

export interface SandboxConfig {
  template?: string;
  timeout?: number;
  envVars?: Record<string, string>;
}

class E2BSandboxManager {
  private connected = false;
  private apiKey: string | null = null;

  async initialize(apiKey: string, _config?: SandboxConfig): Promise<boolean> {
    // In a real implementation, this would call your backend to create an E2B sandbox
    this.apiKey = apiKey;
    this.connected = true;
    console.log('E2B Sandbox initialized (demo mode - requires backend API for full functionality)');
    return true;
  }

  async executeCode(code: string, language: string = 'python'): Promise<ExecutionResult> {
    if (!this.connected) {
      return {
        success: false,
        output: '',
        error: 'Sandbox not initialized. Please configure E2B API key in settings.',
        logs: [],
      };
    }

    // Demo execution - in production, this would call your backend API
    console.log(`Executing ${language} code:`, code.substring(0, 100));

    // Simulate execution delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      output: `[Demo Mode] Code execution requires backend API integration with E2B.\n\nLanguage: ${language}\nCode preview: ${code.substring(0, 100)}...\n\nTo enable real code execution:\n1. Set up a backend API (Next.js, Express, etc.)\n2. Use @e2b/code-interpreter on the server\n3. Call your API from this frontend`,
      logs: ['[info] E2B demo mode active'],
    };
  }

  async executeTerminalCommand(command: string): Promise<ExecutionResult> {
    if (!this.connected) {
      return {
        success: false,
        output: '',
        error: 'Sandbox not initialized',
        logs: [],
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      success: true,
      output: `[Demo Mode] Command: ${command}\nTerminal execution requires backend API.`,
      logs: [],
    };
  }

  async installPackage(packageName: string, manager: 'pip' | 'npm' = 'pip'): Promise<ExecutionResult> {
    const command = manager === 'pip' ? `pip install ${packageName}` : `npm install ${packageName}`;
    return this.executeTerminalCommand(command);
  }

  async writeFile(path: string, content: string): Promise<boolean> {
    console.log(`Writing file ${path}:`, content.substring(0, 50));
    return true;
  }

  async readFile(path: string): Promise<string | null> {
    console.log(`Reading file ${path}`);
    return `[Demo] Content of ${path}`;
  }

  async listFiles(path: string = '/'): Promise<string[]> {
    console.log(`Listing files in ${path}`);
    return ['example.py', 'main.js', 'data.json'];
  }

  async close(): Promise<void> {
    this.connected = false;
    this.apiKey = null;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Singleton instance
export const sandboxManager = new E2BSandboxManager();

// Hook for using sandbox
export function useSandbox() {
  const { e2b } = useSettingsStore();
  const sandboxStore = useSandboxStore();

  const connect = async () => {
    if (!e2b?.apiKey) {
      sandboxStore.setError('E2B API key not configured');
      return false;
    }

    const success = await sandboxManager.initialize(e2b.apiKey);
    sandboxStore.setConnected(success);

    if (!success) {
      sandboxStore.setError('Failed to connect to E2B sandbox');
    }

    return success;
  };

  const disconnect = async () => {
    await sandboxManager.close();
    sandboxStore.setConnected(false);
  };

  const executeCode = async (code: string, language: string = 'python') => {
    if (!sandboxStore.isConnected) {
      const connected = await connect();
      if (!connected) return null;
    }

    sandboxStore.setCurrentExecution({ code, language, status: 'running' });

    const result = await sandboxManager.executeCode(code, language);

    sandboxStore.setCurrentExecution({
      code,
      language,
      status: result.success ? 'completed' : 'error',
      output: result.output,
      error: result.error,
    });

    return result;
  };

  const executeCommand = async (command: string) => {
    if (!sandboxStore.isConnected) {
      const connected = await connect();
      if (!connected) return null;
    }

    return sandboxManager.executeTerminalCommand(command);
  };

  return {
    connect,
    disconnect,
    executeCode,
    executeCommand,
    installPackage: sandboxManager.installPackage.bind(sandboxManager),
    writeFile: sandboxManager.writeFile.bind(sandboxManager),
    readFile: sandboxManager.readFile.bind(sandboxManager),
    listFiles: sandboxManager.listFiles.bind(sandboxManager),
    isConnected: sandboxStore.isConnected,
    currentExecution: sandboxStore.currentExecution,
  };
}
