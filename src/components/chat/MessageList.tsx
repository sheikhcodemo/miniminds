import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Bot, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AIMessage } from '@/lib/types';

interface MessageListProps {
  messages: AIMessage[];
  isGenerating?: boolean;
}

export function MessageList({ messages, isGenerating }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        {isGenerating && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex gap-1 py-3">
                <div className="typing-dot w-2 h-2 rounded-full bg-primary" />
                <div className="typing-dot w-2 h-2 rounded-full bg-primary" />
                <div className="typing-dot w-2 h-2 rounded-full bg-primary" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageItem({ message }: { message: AIMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex items-start gap-3', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-primary' : 'bg-primary/10'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-primary" />
        )}
      </div>

      {/* Content */}
      <div className={cn('flex-1 max-w-[80%]', isUser && 'flex flex-col items-end')}>
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs"
              >
                <Paperclip className="w-3 h-3" />
                <span className="truncate max-w-[120px]">{att.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message bubble */}
        <div className={cn(isUser ? 'message-user' : 'message-assistant')}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;
                    return isInline ? (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className="my-3 rounded-lg overflow-hidden bg-muted p-4">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                }}
              >
                {message.content || '...'}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Streaming indicator */}
        {message.isStreaming && (
          <div className="flex gap-1 mt-1">
            <div className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
