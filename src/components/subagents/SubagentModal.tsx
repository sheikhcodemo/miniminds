import { useState } from 'react';
import { X, Plus, Sparkles, Puzzle, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/stores/settingsStore';

interface SubagentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (config: SubagentConfig) => void;
}

interface SubagentConfig {
  name: string;
  description: string;
  systemPrompt: string;
  tools: string[];
  mcpServers: string[];
}

const builtInTools = [
  { id: 'code_execution', name: 'Code Execution', description: 'Run Python/JS code' },
  { id: 'web_search', name: 'Web Search', description: 'Search the internet' },
  { id: 'file_operations', name: 'File Operations', description: 'Read/write files' },
  { id: 'browser', name: 'Browser', description: 'Navigate web pages' },
  { id: 'image_generation', name: 'Image Generation', description: 'Generate images' },
];

export function SubagentModal({ isOpen, onClose, onCreate }: SubagentModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedMCPs, setSelectedMCPs] = useState<string[]>([]);

  const { mcpServers } = useSettingsStore();
  const enabledMCPs = mcpServers.filter((m) => m.enabled);

  if (!isOpen) return null;

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    );
  };

  const toggleMCP = (mcpId: string) => {
    setSelectedMCPs((prev) =>
      prev.includes(mcpId) ? prev.filter((m) => m !== mcpId) : [...prev, mcpId]
    );
  };

  const handleCreate = () => {
    if (!name.trim()) return;

    onCreate?.({
      name,
      description,
      systemPrompt,
      tools: selectedTools,
      mcpServers: selectedMCPs,
    });

    // Reset form
    setName('');
    setDescription('');
    setSystemPrompt('');
    setSelectedTools([]);
    setSelectedMCPs([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl max-h-[80vh] bg-background rounded-xl shadow-xl border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Create Subagent</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(80vh-130px)]">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Research Assistant"
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this agent do?"
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">System Prompt</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Instructions for the agent..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm resize-none"
              />
            </div>
          </div>

          {/* Built-in Tools */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Built-in Tools</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {builtInTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => toggleTool(tool.id)}
                  className={cn(
                    'p-3 rounded-lg border text-left transition-colors',
                    selectedTools.includes(tool.id)
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  )}
                >
                  <p className="text-sm font-medium">{tool.name}</p>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* MCP Servers */}
          {enabledMCPs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Puzzle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">MCP Servers</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {enabledMCPs.map((mcp) => (
                  <button
                    key={mcp.id}
                    onClick={() => toggleMCP(mcp.id)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-colors',
                      selectedMCPs.includes(mcp.id)
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <p className="text-sm font-medium">{mcp.name}</p>
                    <p className="text-xs text-muted-foreground">{mcp.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              name.trim()
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            <Plus className="w-4 h-4" />
            Create Agent
          </button>
        </div>
      </div>
    </div>
  );
}
