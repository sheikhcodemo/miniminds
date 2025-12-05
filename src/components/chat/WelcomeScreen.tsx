import React from 'react';
import {
  MessageCircle,
  Code,
  Presentation,
  Search,
  Layers,
  Sparkles,
} from 'lucide-react';
import { FEATURE_CATEGORIES, type FeatureMode, type FeatureCategory } from '@/lib/types';

interface WelcomeScreenProps {
  mode: FeatureMode;
  onFeatureClick?: (feature: FeatureCategory) => void;
}

const modeIcons: Record<FeatureMode, React.ReactNode> = {
  chat: <MessageCircle className="w-6 h-6" />,
  code: <Code className="w-6 h-6" />,
  ppt: <Presentation className="w-6 h-6" />,
  research: <Search className="w-6 h-6" />,
  multimodal: <Layers className="w-6 h-6" />,
};

export function WelcomeScreen({ mode, onFeatureClick }: WelcomeScreenProps) {
  const currentFeature = FEATURE_CATEGORIES.find((f) => f.id === mode) || FEATURE_CATEGORIES[0];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mb-4 animate-pulse-glow">
            {modeIcons[mode]}
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">MiniMinds</h1>
          <p className="text-muted-foreground">
            {currentFeature.description}
          </p>
        </div>

        {/* Capabilities */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {currentFeature.capabilities.map((capability, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 text-sm"
            >
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="truncate">{capability}</span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Try one of these:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {getQuickPrompts(mode).map((prompt, index) => (
              <button
                key={index}
                onClick={() => onFeatureClick?.({ ...currentFeature, prompt })}
                className="px-4 py-2 rounded-lg border bg-card hover:bg-muted transition-colors text-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getQuickPrompts(mode: FeatureMode): string[] {
  switch (mode) {
    case 'chat':
      return [
        'Explain quantum computing',
        'Write a haiku about AI',
        'What is the meaning of life?',
      ];
    case 'code':
      return [
        'Create a React todo app',
        'Build a REST API with Node.js',
        'Write a Python web scraper',
      ];
    case 'ppt':
      return [
        'Presentation about AI trends',
        'Startup pitch deck',
        'Quarterly business review',
      ];
    case 'research':
      return [
        'Research latest AI developments',
        'Compare cloud providers',
        'Analyze market trends',
      ];
    case 'multimodal':
      return [
        'Analyze this image',
        'Transcribe this audio',
        'Generate an image of a sunset',
      ];
    default:
      return ['Hello!', 'Help me with...', 'I want to...'];
  }
}
