import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  Search,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSandboxStore } from '@/stores/sandboxStore';

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  path: string;
}

export function FilesPanel() {
  const [expanded, setExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));
  const { files } = useSandboxStore();

  // Convert flat files to tree structure
  const buildTree = (): FileNode[] => {
    if (files.length === 0) {
      // Demo files
      return [
        {
          name: 'src',
          type: 'directory',
          path: '/src',
          children: [
            { name: 'App.tsx', type: 'file', path: '/src/App.tsx' },
            { name: 'main.tsx', type: 'file', path: '/src/main.tsx' },
            { name: 'index.css', type: 'file', path: '/src/index.css' },
          ],
        },
        { name: 'package.json', type: 'file', path: '/package.json' },
        { name: 'README.md', type: 'file', path: '/README.md' },
      ];
    }

    return files.map((f) => ({
      name: f.name,
      type: f.type,
      path: f.path,
    }));
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderNode = (node: FileNode, depth = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const matchesSearch = searchQuery
      ? node.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    if (!matchesSearch && node.type === 'file') return null;

    return (
      <div key={node.path}>
        <button
          onClick={() => node.type === 'directory' && toggleFolder(node.path)}
          className={cn(
            'w-full flex items-center gap-2 px-2 py-1 text-sm rounded hover:bg-muted/50 transition-colors',
            'text-left'
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {node.type === 'directory' ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-yellow-500" />
              ) : (
                <Folder className="w-4 h-4 text-yellow-500" />
              )}
            </>
          ) : (
            <>
              <span className="w-4" />
              <File className="w-4 h-4 text-muted-foreground" />
            </>
          )}
          <span className="truncate">{node.name}</span>
        </button>

        {node.type === 'directory' && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree();

  return (
    <div className="flex-1 flex flex-col border-b border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
      >
        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        Files
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded hover:bg-muted"
          >
            <Plus className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded hover:bg-muted"
          >
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </button>

      {expanded && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded border bg-background"
              />
            </div>
          </div>

          {/* File tree */}
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {tree.map((node) => renderNode(node))}
          </div>
        </div>
      )}
    </div>
  );
}
