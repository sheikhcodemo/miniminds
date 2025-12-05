import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Play, Terminal, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/stores/settingsStore';
import { useSandbox } from '@/lib/e2b/sandbox';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  executable?: boolean;
  onExecute?: (result: { output: string; error?: string }) => void;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'text',
  filename,
  showLineNumbers = true,
  executable = false,
  onExecute,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { theme } = useSettingsStore();
  const { executeCode, isConnected } = useSandbox();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = async () => {
    if (!executable) return;

    setIsExecuting(true);
    setOutput(null);
    setError(null);

    const result = await executeCode(code, language);

    if (result) {
      setOutput(result.output);
      if (result.error) {
        setError(result.error);
      }
      onExecute?.({ output: result.output, error: result.error });
    }

    setIsExecuting(false);
  };

  const canExecute = executable && ['python', 'javascript', 'typescript'].includes(language);

  return (
    <div className="rounded-lg border border-border overflow-hidden my-3">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {filename || language}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {canExecute && (
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className={cn(
                'p-1.5 rounded hover:bg-muted transition-colors',
                isExecuting && 'opacity-50 cursor-not-allowed'
              )}
              title="Run code"
            >
              {isExecuting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4 text-green-500" />
              )}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={language}
        style={theme === 'dark' ? oneDark : oneLight}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: theme === 'dark' ? '#1e1e1e' : '#fafafa',
        }}
        lineNumberStyle={{
          minWidth: '3em',
          paddingRight: '1em',
          color: theme === 'dark' ? '#6e7681' : '#999',
        }}
      >
        {code}
      </SyntaxHighlighter>

      {/* Output */}
      {(output || error) && (
        <div className="border-t border-border">
          <div className="px-4 py-2 bg-muted/30">
            <span className="text-xs font-medium text-muted-foreground">Output</span>
          </div>
          <pre
            className={cn(
              'p-4 text-sm font-mono overflow-x-auto',
              error ? 'text-red-500 bg-red-50 dark:bg-red-950/20' : 'bg-background'
            )}
          >
            {error || output}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
