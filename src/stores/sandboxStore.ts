import { create } from 'zustand';
import type { SandboxState, SandboxFile, OutputLine } from '@/lib/types';

interface CurrentExecution {
  code: string;
  language: string;
  status: 'running' | 'completed' | 'error';
  output?: string;
  error?: string;
}

interface SandboxStoreState extends SandboxState {
  isConnected: boolean;
  currentExecution: CurrentExecution | null;
  setStatus: (status: SandboxState['status']) => void;
  setSandboxId: (id: string | null) => void;
  setConnected: (connected: boolean) => void;
  setCurrentExecution: (execution: CurrentExecution | null) => void;
  addOutput: (line: Omit<OutputLine, 'timestamp'>) => void;
  clearOutput: () => void;
  setFiles: (files: SandboxFile[]) => void;
  addFile: (file: SandboxFile) => void;
  updateFile: (path: string, updates: Partial<SandboxFile>) => void;
  removeFile: (path: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: SandboxState & { isConnected: boolean; currentExecution: CurrentExecution | null } = {
  id: null,
  status: 'idle',
  files: [],
  output: [],
  error: null,
  isConnected: false,
  currentExecution: null,
};

export const useSandboxStore = create<SandboxStoreState>((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),

  setSandboxId: (id) => set({ id }),

  setConnected: (isConnected) => set({ isConnected, status: isConnected ? 'running' : 'idle' }),

  setCurrentExecution: (currentExecution) => set({ currentExecution }),

  addOutput: (line) =>
    set((state) => ({
      output: [...state.output, { ...line, timestamp: new Date() }],
    })),

  clearOutput: () => set({ output: [] }),

  setFiles: (files) => set({ files }),

  addFile: (file) =>
    set((state) => ({ files: [...state.files, file] })),

  updateFile: (path, updates) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.path === path ? { ...f, ...updates } : f
      ),
    })),

  removeFile: (path) =>
    set((state) => ({
      files: state.files.filter((f) => f.path !== path),
    })),

  setError: (error) => set({ error, status: error ? 'error' : 'idle' }),

  reset: () => set(initialState),
}));
