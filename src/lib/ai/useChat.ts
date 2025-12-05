import { useState, useCallback, useRef } from 'react';
import { streamText } from 'ai';
import { createAIProvider, getModelId, MODE_PROMPTS } from './providers';
import { useSettingsStore } from '@/stores/settingsStore';
import { useChatStore } from '@/stores/chatStore';
import type { AIProvider, FeatureMode } from '@/lib/types';

interface UseChatOptions {
  onError?: (error: Error) => void;
  onFinish?: (message: string) => void;
}

export function useAIChat(options: UseChatOptions = {}) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const { providers, defaultProvider, defaultModel } = useSettingsStore();
  const { currentMode, addMessage, updateMessage, setIsGenerating, activeChat } = useChatStore();

  const sendMessage = useCallback(
    async (content: string, attachments?: File[]) => {
      if (!activeChat) {
        console.error('No active chat');
        return;
      }

      const provider = providers[defaultProvider];
      if (!provider?.apiKey) {
        options.onError?.(new Error('Please configure an AI provider in settings'));
        return;
      }

      // Add user message with attachments
      const attachmentData = attachments?.map((f, index) => ({
        id: `attach-${Date.now()}-${index}`,
        name: f.name,
        type: f.type,
        size: f.size,
        url: URL.createObjectURL(f),
      }));

      addMessage(activeChat, {
        role: 'user',
        content,
        attachments: attachmentData,
      });

      // Create assistant message placeholder
      addMessage(activeChat, {
        role: 'assistant',
        content: '',
      });

      setIsStreaming(true);
      setIsGenerating(true);
      setStreamedContent('');

      // Create abort controller
      abortControllerRef.current = new AbortController();

      try {
        const aiProvider = createAIProvider(defaultProvider, provider.apiKey);
        const modelId = getModelId(defaultProvider, defaultModel);

        // Get system prompt for current mode
        const systemPrompt = MODE_PROMPTS[currentMode as keyof typeof MODE_PROMPTS] || MODE_PROMPTS.chat;

        // Get chat history
        const { chats } = useChatStore.getState();
        const chat = chats.find((c) => c.id === activeChat);
        const messages = chat?.messages.slice(0, -1).map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })) || [];

        // Add current message
        messages.push({ role: 'user', content });

        let fullText = '';

        const result = await streamText({
          model: aiProvider(modelId),
          system: systemPrompt,
          messages,
          abortSignal: abortControllerRef.current.signal,
        });

        // Stream the text
        for await (const textPart of result.textStream) {
          fullText += textPart;
          setStreamedContent(fullText);

          // Update message in real-time
          const { chats: updatedChats } = useChatStore.getState();
          const updatedChat = updatedChats.find((c) => c.id === activeChat);
          if (updatedChat) {
            const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
            if (lastMessage?.role === 'assistant') {
              updateMessage(activeChat, lastMessage.id, { content: fullText });
            }
          }
        }

        options.onFinish?.(fullText);
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          console.log('Stream aborted');
        } else {
          console.error('Stream error:', error);
          options.onError?.(error as Error);

          // Update message with error
          const { chats: updatedChats } = useChatStore.getState();
          const updatedChat = updatedChats.find((c) => c.id === activeChat);
          if (updatedChat) {
            const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
            if (lastMessage?.role === 'assistant') {
              updateMessage(activeChat, lastMessage.id, {
                content: `Error: ${(error as Error).message}`,
              });
            }
          }
        }
      } finally {
        setIsStreaming(false);
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    },
    [activeChat, providers, defaultProvider, defaultModel, currentMode, addMessage, updateMessage, setIsGenerating, options]
  );

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setIsGenerating(false);
    }
  }, [setIsGenerating]);

  return {
    sendMessage,
    stopStreaming,
    isStreaming,
    streamedContent,
  };
}
