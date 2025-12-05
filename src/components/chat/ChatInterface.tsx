import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Square, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chatStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { MessageList } from './MessageList';
import { WelcomeScreen } from './WelcomeScreen';
import { useAIChat } from '@/lib/ai/useChat';
import { FEATURE_CATEGORIES, type FeatureMode, type FeatureCategory } from '@/lib/types';

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    chats,
    activeChat,
    currentMode,
    isGenerating,
    setIsGenerating,
    createChat,
    addMessage,
    updateMessage,
  } = useChatStore();

  const { defaultProvider, defaultModel, providers, getActiveProvider } = useSettingsStore();

  // AI Chat hook with streaming
  const { sendMessage, stopStreaming, isStreaming, streamedContent } = useAIChat({
    onError: (err) => setError(err.message),
    onFinish: () => setError(null),
  });

  const currentChat = chats.find((c) => c.id === activeChat);
  const messages = currentChat?.messages || [];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isGenerating || isStreaming) return;

    const provider = getActiveProvider();
    if (!provider) {
      setError('Please configure an AI provider in settings first.');
      return;
    }

    // Create chat if none exists
    let chatId = activeChat;
    if (!chatId) {
      chatId = createChat(currentMode, defaultProvider, defaultModel);
    }

    setInput('');
    setError(null);

    // Use the AI streaming hook
    if (provider.apiKey) {
      await sendMessage(trimmedInput, attachments.length > 0 ? attachments : undefined);
      setAttachments([]);
    } else {
      // Fallback to demo mode
      addMessage(chatId, { role: 'user', content: trimmedInput });
      setIsGenerating(true);

      addMessage(chatId, {
        role: 'assistant',
        content: '',
        isStreaming: true,
      });

      try {
        const demoResponse = await simulateAIResponse(trimmedInput, currentMode);
        const lastMessage = chats.find(c => c.id === chatId)?.messages.slice(-1)[0];
        if (lastMessage) {
          updateMessage(chatId, lastMessage.id, {
            content: demoResponse,
            isStreaming: false,
          });
        }
      } catch (err) {
        console.error('Error generating response:', err);
        const lastMessage = chats.find(c => c.id === chatId)?.messages.slice(-1)[0];
        if (lastMessage) {
          updateMessage(chatId, lastMessage.id, {
            content: 'Sorry, an error occurred. Please check your API keys in settings.',
            isStreaming: false,
          });
        }
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFeatureClick = (feature: FeatureCategory) => {
    if (feature.prompt) {
      setInput(feature.prompt);
    }
  };

  const stopGeneration = () => {
    stopStreaming();
    setIsGenerating(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeScreen
            mode={currentMode}
            onFeatureClick={handleFeatureClick}
          />
        ) : (
          <MessageList messages={messages} isGenerating={isGenerating} />
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Error Display */}
          {error && (
            <div className="mb-3 p-3 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm"
                >
                  <Paperclip className="w-3 h-3" />
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="input-glow">
            <div className="relative flex items-end gap-2 p-3 rounded-xl border bg-background">
              {/* Attachment Button */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.txt,.md,.json,.csv"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message MiniMinds (${currentMode} mode)...`}
                className="flex-1 resize-none bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground min-h-[24px] max-h-[200px]"
                rows={1}
                disabled={isGenerating || isStreaming}
              />

              {/* Send/Stop Button */}
              {(isGenerating || isStreaming) ? (
                <button
                  type="button"
                  onClick={stopGeneration}
                  className="p-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                  <Square className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    input.trim()
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-secondary text-muted-foreground'
                  )}
                >
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Mode indicator */}
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
            <span className="provider-badge">
              {providers[defaultProvider]?.name || 'No provider'}
            </span>
            <span>•</span>
            <span>{defaultModel || 'No model selected'}</span>
            {isStreaming && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-primary">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Streaming...
                </span>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// Simulated AI response for demo purposes
async function simulateAIResponse(input: string, mode: FeatureMode): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const responses: Record<FeatureMode, string> = {
    chat: `I understand you're asking about: "${input.slice(0, 50)}..."

This is a demo response. To get real AI responses, please:
1. Go to Settings
2. Add your API key for Groq, Google AI, or another provider
3. The key will be stored locally in your browser

Once configured, MiniMinds will use the Vercel AI SDK to stream responses from your chosen provider.`,

    code: `I'll help you with code generation for: "${input.slice(0, 30)}..."

\`\`\`typescript
// Example code output
function example() {
  console.log("This is a demo");
  // Real code generation requires API keys
}
\`\`\`

To execute code in an E2B sandbox:
1. Configure your E2B API key in Settings
2. Write or generate code
3. Click "Run" to execute in a secure sandbox`,

    ppt: `I'll create a presentation about: "${input.slice(0, 30)}..."

## Slide 1: Title
# ${input.slice(0, 20)}

## Slide 2: Overview
- Point 1
- Point 2
- Point 3

To generate real presentations with export to PPTX, configure your API keys in Settings.`,

    research: `# Research Report: ${input.slice(0, 30)}...

## Summary
This is a demo research response.

## Key Findings
1. Finding one
2. Finding two
3. Finding three

## Sources
To perform real deep research with web search and analysis, configure your API keys and enable MCP servers in Settings.`,

    multimodal: `I can process multiple types of content for: "${input.slice(0, 30)}..."

**Supported inputs:**
- Text documents
- Images (analysis)
- Audio files
- Video content

**Generation capabilities:**
- Image generation
- Audio synthesis

Configure Google AI (Gemini) for multimodal capabilities in Settings.`,
  };

  return responses[mode] || responses.chat;
}
