import React, { useState } from 'react';
import { ExternalLink, Code, Eye, Copy, Check, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArtifactProps {
  type: 'code' | 'html' | 'react' | 'svg' | 'markdown';
  title: string;
  content: string;
  language?: string;
  previewable?: boolean;
}

export const Artifact: React.FC<ArtifactProps> = ({
  type,
  title,
  content,
  language,
  previewable = false,
}) => {
  const [view, setView] = useState<'code' | 'preview'>('code');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const canPreview = previewable || ['html', 'svg'].includes(type);

  return (
    <div className="my-4 rounded-lg border border-border overflow-hidden bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">{title}</span>
          <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
            {language || type}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {canPreview && (
            <div className="flex items-center mr-2 p-0.5 rounded-md bg-muted">
              <button
                onClick={() => setView('code')}
                className={cn(
                  'px-2 py-1 rounded text-xs font-medium transition-colors',
                  view === 'code'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Code className="h-3 w-3" />
              </button>
              <button
                onClick={() => setView('preview')}
                className={cn(
                  'px-2 py-1 rounded text-xs font-medium transition-colors',
                  view === 'preview'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Eye className="h-3 w-3" />
              </button>
            </div>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            title="Copy"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      {view === 'code' ? (
        <pre className="p-4 overflow-x-auto text-sm">
          <code>{content}</code>
        </pre>
      ) : (
        <div className="p-4 bg-white">
          {type === 'html' || type === 'svg' ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <pre className="text-sm">{content}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default Artifact;
