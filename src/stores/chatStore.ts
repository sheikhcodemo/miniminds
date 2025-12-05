import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Chat, AIMessage, FeatureMode, AIProvider } from '@/lib/types';

interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  currentMode: FeatureMode;
  isGenerating: boolean;

  // Actions
  createChat: (mode: FeatureMode, provider: AIProvider, model: string) => string;
  deleteChat: (id: string) => void;
  setActiveChat: (id: string | null) => void;
  setCurrentMode: (mode: FeatureMode) => void;
  setIsGenerating: (value: boolean) => void;
  addMessage: (chatId: string, message: Omit<AIMessage, 'id' | 'createdAt'>) => void;
  updateMessage: (chatId: string, messageId: string, updates: Partial<AIMessage>) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  getActiveMessages: () => AIMessage[];
  clearChat: (chatId: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChat: null,
      currentMode: 'chat',
      isGenerating: false,

      createChat: (mode, provider, model) => {
        const id = generateId();
        const chat: Chat = {
          id,
          title: 'New Chat',
          messages: [],
          provider,
          model,
          mode,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          chats: [chat, ...state.chats],
          activeChat: id,
          currentMode: mode,
        }));
        return id;
      },

      deleteChat: (id) =>
        set((state) => {
          const filtered = state.chats.filter((c) => c.id !== id);
          return {
            chats: filtered,
            activeChat: state.activeChat === id
              ? (filtered[0]?.id || null)
              : state.activeChat,
          };
        }),

      setActiveChat: (id) => set({ activeChat: id }),

      setCurrentMode: (mode) => set({ currentMode: mode }),

      setIsGenerating: (value) => set({ isGenerating: value }),

      addMessage: (chatId, message) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    { ...message, id: generateId(), createdAt: new Date() },
                  ],
                  updatedAt: new Date(),
                  title: chat.messages.length === 0 && message.role === 'user'
                    ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                    : chat.title,
                }
              : chat
          ),
        })),

      updateMessage: (chatId, messageId, updates) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, ...updates } : msg
                  ),
                  updatedAt: new Date(),
                }
              : chat
          ),
        })),

      updateChatTitle: (chatId, title) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, title } : chat
          ),
        })),

      getActiveMessages: () => {
        const state = get();
        const chat = state.chats.find((c) => c.id === state.activeChat);
        return chat?.messages || [];
      },

      clearChat: (chatId) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, messages: [], title: 'New Chat', updatedAt: new Date() }
              : chat
          ),
        })),
    }),
    {
      name: 'miniminds-chats',
      partialize: (state) => ({
        chats: state.chats.slice(0, 50),
        activeChat: state.activeChat,
        currentMode: state.currentMode,
      }),
    }
  )
);
