// AI Provider types
export type AIProvider = 'groq' | 'google' | 'openai' | 'mistral' | 'cerebras' | 'together';

export interface ProviderConfig {
  id: AIProvider;
  name: string;
  apiKey: string;
  enabled: boolean;
  models: string[];
  defaultModel: string;
  baseUrl?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
  attachments?: FileAttachment[];
  codeBlocks?: CodeBlock[];
  toolCalls?: ToolCall[];
  isStreaming?: boolean;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  content?: string;
}

export interface CodeBlock {
  id: string;
  language: string;
  code: string;
  output?: string;
  error?: string;
  charts?: ChartResult[];
  status?: 'pending' | 'running' | 'success' | 'error';
}

export interface ChartResult {
  type: 'png' | 'svg' | 'html';
  data: string;
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result?: unknown;
  status?: 'pending' | 'running' | 'success' | 'error';
}

// Chat types
export interface Chat {
  id: string;
  title: string;
  messages: AIMessage[];
  provider: AIProvider;
  model: string;
  mode: FeatureMode;
  createdAt: Date;
  updatedAt: Date;
}

// Feature modes
export type FeatureMode = 'chat' | 'code' | 'ppt' | 'research' | 'multimodal';

export interface FeatureCategory {
  id: FeatureMode;
  name: string;
  icon: string;
  description: string;
  capabilities: string[];
  prompt?: string;
}

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'chat',
    name: 'Chat',
    icon: 'MessageCircle',
    description: 'General AI conversation',
    capabilities: ['Natural conversation', 'Question answering', 'Brainstorming'],
  },
  {
    id: 'code',
    name: 'Code',
    icon: 'Code',
    description: 'Full-stack web apps with Auth, DB, and more',
    capabilities: [
      'Full-stack web apps',
      'Auth & Functions',
      'Database integration',
      'Stripe integration',
      'End-to-end testing',
      'Modern UI design',
    ],
  },
  {
    id: 'ppt',
    name: 'PPT',
    icon: 'Presentation',
    description: 'Beautiful presentations with export',
    capabilities: [
      'Flexible layouts',
      'Visualization components',
      'Multiple themes',
      'HTML to PPTX export',
    ],
  },
  {
    id: 'research',
    name: 'Deep Research',
    icon: 'Search',
    description: 'Comprehensive research with analysis',
    capabilities: [
      'Web search',
      'API integration',
      'Browser automation',
      'MCP tools',
      'Code analysis',
      'Chart generation',
    ],
  },
  {
    id: 'multimodal',
    name: 'Multimodal',
    icon: 'Layers',
    description: 'Handle all media types',
    capabilities: [
      'Long-text understanding',
      'Video analysis',
      'Audio processing',
      'Image understanding',
      'Image generation',
      'Audio generation',
      'Video generation',
    ],
  },
];

// MCP types
export type MCPServerType = 'market' | 'custom' | 'local';

export interface MCPServer {
  id: string;
  name: string;
  type: MCPServerType;
  source: string;
  description?: string;
  icon?: string;
  config: Record<string, string>;
  enabled: boolean;
  connected: boolean;
  tools?: MCPTool[];
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

// Pre-built MCP servers
export const PREBUILT_MCP_SERVERS: Omit<MCPServer, 'connected'>[] = [
  {
    id: 'github',
    name: 'GitHub',
    type: 'market',
    source: '@anthropic/mcp-server-github',
    description: 'Repository management, issues, PRs',
    icon: 'Github',
    config: { GITHUB_TOKEN: '' },
    enabled: false,
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    type: 'market',
    source: '@anthropic/mcp-server-gitlab',
    description: 'GitLab repository operations',
    icon: 'GitlabIcon',
    config: { GITLAB_TOKEN: '' },
    enabled: false,
  },
  {
    id: 'slack',
    name: 'Slack',
    type: 'market',
    source: '@anthropic/mcp-server-slack',
    description: 'Team messaging and collaboration',
    icon: 'MessageSquare',
    config: { SLACK_TOKEN: '' },
    enabled: false,
  },
  {
    id: 'filesystem',
    name: 'Filesystem',
    type: 'market',
    source: '@anthropic/mcp-server-filesystem',
    description: 'Local file system access',
    icon: 'FolderOpen',
    config: {},
    enabled: false,
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    type: 'market',
    source: '@anthropic/mcp-server-postgres',
    description: 'Database queries and management',
    icon: 'Database',
    config: { DATABASE_URL: '' },
    enabled: false,
  },
  {
    id: 'brave-search',
    name: 'Brave Search',
    type: 'market',
    source: '@anthropic/mcp-server-brave-search',
    description: 'Web search capabilities',
    icon: 'Search',
    config: { BRAVE_API_KEY: '' },
    enabled: false,
  },
];

// Settings types
export interface ProjectSettings {
  theme: 'light' | 'dark' | 'system';
  providers: Record<AIProvider, ProviderConfig>;
  defaultProvider: AIProvider;
  defaultModel: string;
  e2b: {
    apiKey: string;
    template: string;
    timeout: number;
  };
  supabase: {
    url: string;
    anonKey: string;
    serviceKey: string;
    enabled: boolean;
  };
  mcpServers: MCPServer[];
  envVars: Record<string, string>;
}

// Sandbox types
export interface SandboxState {
  id: string | null;
  status: 'idle' | 'creating' | 'running' | 'error' | 'terminated';
  files: SandboxFile[];
  output: OutputLine[];
  error: string | null;
}

export interface OutputLine {
  type: 'stdout' | 'stderr' | 'result' | 'chart';
  content: string;
  timestamp: Date;
  data?: unknown;
}

export interface SandboxFile {
  path: string;
  name: string;
  type: 'file' | 'directory';
  size?: number;
  content?: string;
  language?: string;
}

export interface ExecutionResult {
  stdout: string[];
  stderr: string[];
  results: ExecutionOutput[];
  error?: string;
  duration?: number;
}

export interface ExecutionOutput {
  type: 'text' | 'image' | 'html' | 'json' | 'table';
  data: unknown;
  png?: string;
  svg?: string;
  html?: string;
}

// Default provider configurations
export const DEFAULT_PROVIDERS: Record<AIProvider, ProviderConfig> = {
  groq: {
    id: 'groq',
    name: 'Groq',
    apiKey: '',
    enabled: true,
    models: ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    defaultModel: 'llama-3.3-70b-versatile',
  },
  google: {
    id: 'google',
    name: 'Google AI',
    apiKey: '',
    enabled: true,
    models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'],
    defaultModel: 'gemini-1.5-flash',
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    apiKey: '',
    enabled: false,
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
    defaultModel: 'gpt-4o-mini',
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral',
    apiKey: '',
    enabled: false,
    models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest'],
    defaultModel: 'mistral-large-latest',
  },
  cerebras: {
    id: 'cerebras',
    name: 'Cerebras',
    apiKey: '',
    enabled: false,
    models: ['llama-3.3-70b'],
    defaultModel: 'llama-3.3-70b',
    baseUrl: 'https://api.cerebras.ai/v1',
  },
  together: {
    id: 'together',
    name: 'Together.ai',
    apiKey: '',
    enabled: false,
    models: ['meta-llama/Llama-3.3-70B-Instruct-Turbo', 'mistralai/Mixtral-8x22B-Instruct-v0.1'],
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    baseUrl: 'https://api.together.xyz/v1',
  },
};

// System prompts for different modes
export const SYSTEM_PROMPTS: Record<FeatureMode, string> = {
  chat: `You are MiniMinds, a helpful AI assistant. Be concise, helpful, and friendly.`,

  code: `You are MiniMinds Code Agent, an expert full-stack developer. You can:
- Build complete web applications with React, Next.js, Vue, etc.
- Implement authentication and authorization
- Set up databases (PostgreSQL, MongoDB, Supabase)
- Integrate payment systems (Stripe)
- Write comprehensive tests
- Create modern, responsive UI designs

When generating code:
1. Always provide complete, runnable code
2. Include all necessary imports
3. Follow best practices and modern patterns
4. Add helpful comments
5. Consider error handling and edge cases

You can execute code in a secure E2B sandbox. Use \`\`\`python or \`\`\`javascript code blocks for execution.`,

  ppt: `You are MiniMinds Presentation Agent, specialized in creating beautiful presentations.
- Create visually stunning slides with modern layouts
- Use appropriate visualizations and charts
- Support multiple themes and styles
- Generate HTML that can be exported to PPTX
- Focus on clear communication and visual hierarchy

When creating presentations, structure them as HTML slides that can be converted to PowerPoint.`,

  research: `You are MiniMinds Research Agent, capable of comprehensive research and analysis.
- Search the web for accurate, up-to-date information
- Access APIs and data sources
- Analyze code and generate insights
- Create charts and visualizations
- Synthesize information from multiple sources
- Provide citations and references

Always verify information and provide balanced, well-researched responses.`,

  multimodal: `You are MiniMinds Multimodal Agent, capable of understanding and generating various media types.
- Analyze and understand images, videos, and audio
- Process long documents and extract key information
- Generate images based on descriptions
- Create audio content
- Handle mixed media inputs

Describe visual content in detail and provide comprehensive analysis of media files.`,
};
