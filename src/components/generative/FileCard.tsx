import React from 'react';
import {
  FileCode,
  FileImage,
  FileText,
  FileSpreadsheet,
  FileAudio,
  FileVideo,
  File,
  Download,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileCardProps {
  name: string;
  type?: string;
  size?: number;
  url?: string;
  preview?: string;
  onView?: () => void;
  onDownload?: () => void;
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  code: <FileCode className="h-8 w-8 text-blue-500" />,
  image: <FileImage className="h-8 w-8 text-green-500" />,
  document: <FileText className="h-8 w-8 text-orange-500" />,
  spreadsheet: <FileSpreadsheet className="h-8 w-8 text-emerald-500" />,
  audio: <FileAudio className="h-8 w-8 text-purple-500" />,
  video: <FileVideo className="h-8 w-8 text-red-500" />,
  default: <File className="h-8 w-8 text-gray-500" />,
};

const getFileType = (name: string): string => {
  const ext = name.split('.').pop()?.toLowerCase() || '';

  if (['js', 'ts', 'tsx', 'jsx', 'py', 'go', 'rs', 'java', 'cpp', 'c', 'html', 'css', 'json'].includes(ext)) {
    return 'code';
  }
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'].includes(ext)) {
    return 'image';
  }
  if (['pdf', 'doc', 'docx', 'txt', 'md', 'rtf'].includes(ext)) {
    return 'document';
  }
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return 'spreadsheet';
  }
  if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(ext)) {
    return 'audio';
  }
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) {
    return 'video';
  }
  return 'default';
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const FileCard: React.FC<FileCardProps> = ({
  name,
  type,
  size,
  url,
  preview,
  onView,
  onDownload,
}) => {
  const fileType = type || getFileType(name);
  const isImage = fileType === 'image';

  return (
    <div className="inline-flex flex-col rounded-lg border border-border bg-card overflow-hidden min-w-[200px] max-w-[300px]">
      {/* Preview */}
      {isImage && preview ? (
        <div className="h-32 bg-muted flex items-center justify-center overflow-hidden">
          <img
            src={preview}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-24 bg-muted/50 flex items-center justify-center">
          {FILE_ICONS[fileType] || FILE_ICONS.default}
        </div>
      )}

      {/* Info */}
      <div className="p-3">
        <p className="font-medium text-sm truncate" title={name}>
          {name}
        </p>
        {size && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatFileSize(size)}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center border-t border-border">
        {onView && (
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs hover:bg-muted transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
        )}
        {onDownload && (
          <button
            onClick={onDownload}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 text-xs hover:bg-muted transition-colors',
              onView && 'border-l border-border'
            )}
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 text-xs hover:bg-muted transition-colors',
              (onView || onDownload) && 'border-l border-border'
            )}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </a>
        )}
      </div>
    </div>
  );
};

export default FileCard;
