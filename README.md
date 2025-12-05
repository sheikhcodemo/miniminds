# MiniMinds

A powerful AI Agent alternative to MiniMax Agent, built with free AI model providers and modern web technologies.

![MiniMinds](https://img.shields.io/badge/MiniMinds-AI%20Agent-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

### Core Capabilities
- **Multi-Provider AI Support** - Integrates with Groq, Google AI, Cerebras, Together.ai, Mistral, and OpenAI
- **E2B Sandbox Integration** - Secure code execution in isolated sandbox environments
- **MCP (Model Context Protocol)** - Extensible tool system with market and custom MCPs
- **PWA Enabled** - Install as a progressive web app

### Chat Modes
- **Chat** - General conversation mode
- **Code** - Full-stack code generation with live preview
- **PPT** - Presentation creation with flexible layouts
- **Research** - Deep research with web search and analysis
- **Multimodal** - Support for images, audio, and video

### Workspace Features
- **Window Management** - Split views with multiple panels
- **Current Process Tracking** - Real-time progress monitoring
- **Files Panel** - Persistent file management
- **Ongoing Tasks** - Background task management
- **Subagent Creation** - Custom AI agents with specific tools

### UI/UX
- **Dark/Light Theme** - System preference aware
- **Responsive Design** - Works on desktop and mobile
- **Keyboard Shortcuts** - Power user support
- **Generative UI** - Dynamic UI components

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **AI SDK**: Vercel AI SDK
- **Code Execution**: E2B Code Interpreter
- **PWA**: vite-plugin-pwa

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/sheikhcodemo/miniminds.git
cd miniminds

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Configuration

1. Open Settings (gear icon)
2. Configure at least one AI provider:
   - **Groq** - Get API key from [console.groq.com](https://console.groq.com)
   - **Google AI** - Get API key from [aistudio.google.com](https://aistudio.google.com)
   - **Cerebras** - Get API key from [cloud.cerebras.ai](https://cloud.cerebras.ai)
   - **Together.ai** - Get API key from [together.ai](https://together.ai)
   - **Mistral** - Get API key from [mistral.ai](https://mistral.ai)

3. (Optional) Configure E2B for code execution:
   - Get API key from [e2b.dev](https://e2b.dev)
   - Enter in Settings > E2B Sandbox

### Build for Production

```bash
pnpm build
```

## Project Structure

```
miniminds/
├── src/
│   ├── components/
│   │   ├── chat/           # Chat interface components
│   │   ├── generative/     # Generative UI components
│   │   ├── layout/         # Sidebar, Header
│   │   ├── settings/       # Settings panel
│   │   ├── subagents/      # Subagent creation
│   │   └── workspace/      # Window, Process, Files, Tasks
│   ├── stores/             # Zustand state stores
│   ├── lib/                # Types, utilities, AI providers
│   └── App.tsx             # Main application
├── public/                 # Static assets
└── package.json
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Acknowledgments

- [MiniMax Agent](https://agent.minimax.io) - Inspiration for this project
- [Vercel AI SDK](https://sdk.vercel.ai) - AI integration
- [E2B](https://e2b.dev) - Code execution sandbox
- [shadcn/ui](https://ui.shadcn.com) - UI components

---

Built with Matrix Agent
