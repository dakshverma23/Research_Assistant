// Shared types for ResearchAI

export interface ResearchQuery {
  query: string;
  sources?: ('web' | 'wikipedia' | 'news' | 'academic')[];
  maxResults?: number;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: 'web' | 'wikipedia' | 'news' | 'academic';
  retrievedAt: Date;
}

export interface ResearchProgress {
  stage: 'analyzing' | 'searching' | 'extracting' | 'synthesizing' | 'generating' | 'complete' | 'error';
  message: string;
  progress: number; // 0-100
  sources?: Source[];
  error?: string;
}

export interface ResearchReport {
  id: string;
  query: string;
  createdAt: Date;
  executiveSummary: string;
  keyFindings: Finding[];
  detailedSections: Section[];
  sources: Source[];
  metadata: {
    totalSources: number;
    processingTime: number;
    modelUsed: string;
  };
}

export interface Finding {
  title: string;
  description: string;
  evidence: string;
  sourceIds: string[];
}

export interface Section {
  title: string;
  content: string;
  subsections?: Section[];
}

export interface AIModelConfig {
  provider: 'openrouter';
  model: string;
  apiKey: string;
}

export const STAGE_MESSAGES: Record<ResearchProgress['stage'], string> = {
  analyzing: 'Analyzing your research query...',
  searching: 'Searching multiple sources...',
  extracting: 'Extracting content from sources...',
  synthesizing: 'Synthesizing findings with AI...',
  generating: 'Generating structured report...',
  complete: 'Research complete!',
  error: 'An error occurred during research.'
};

// Best free model available on OpenRouter
export const DEFAULT_MODEL = 'meta-llama/llama-3.1-70b-instruct:free';

export const SUPPORTED_MODELS = [
  // Free Models (Best to Good)
  'meta-llama/llama-3.1-70b-instruct:free',      // Best free - 70B parameters
  'meta-llama/llama-3.1-8b-instruct:free',       // Fast free - 8B parameters
  'google/gemma-2-9b-it:free',                   // Google's free model
  'mistralai/mistral-7b-instruct:free',          // Mistral free
  'microsoft/phi-3-mini-128k-instruct:free',     // Microsoft free
  
  // Paid Models (Premium quality)
  'anthropic/claude-sonnet-4',
  'anthropic/claude-3.5-sonnet',
  'openai/gpt-4o',
  'openai/gpt-4o-mini',
  'google/gemini-pro-1.5'
] as const;