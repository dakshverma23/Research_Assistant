import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ResearchQuery } from 'shared'

interface EnhancedQueryInputProps {
  onSubmit: (query: ResearchQuery) => void
}

const RESEARCH_MODES = [
  {
    id: 'general',
    name: 'General',
    icon: '🔍',
    description: 'Broad research across all sources',
    sources: ['web', 'wikipedia']
  },
  {
    id: 'academic',
    name: 'Academic',
    icon: '🎓',
    description: 'Scholarly articles and papers',
    sources: ['web', 'wikipedia', 'academic']
  },
  {
    id: 'news',
    name: 'News',
    icon: '📰',
    description: 'Latest news and current events',
    sources: ['news', 'web']
  },
  {
    id: 'technical',
    name: 'Technical',
    icon: '💻',
    description: 'Code, APIs, and documentation',
    sources: ['web']
  }
]

const QUERY_TEMPLATES = [
  { label: 'Compare', template: 'Compare {topic1} vs {topic2}', placeholder: 'e.g., React vs Vue' },
  { label: 'Explain', template: 'Explain {concept}', placeholder: 'e.g., quantum computing' },
  { label: 'History', template: 'What is the history of {topic}?', placeholder: 'e.g., artificial intelligence' },
  { label: 'Pros/Cons', template: 'What are the pros and cons of {topic}?', placeholder: 'e.g., remote work' },
  { label: 'Latest', template: 'What are the latest developments in {field}?', placeholder: 'e.g., renewable energy' },
  { label: 'How-to', template: 'How to {action}?', placeholder: 'e.g., build a REST API' }
]

export default function EnhancedQueryInput({ onSubmit }: EnhancedQueryInputProps) {
  const [query, setQuery] = useState('')
  const [selectedMode, setSelectedMode] = useState('general')
  const [showTemplates, setShowTemplates] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (query.trim()) {
      const mode = RESEARCH_MODES.find(m => m.id === selectedMode)
      onSubmit({
        query: query.trim(),
        sources: mode?.sources as any || ['web', 'wikipedia'],
        maxResults: 15
      })
    }
  }

  const applyTemplate = (template: string) => {
    setQuery(template)
    setShowTemplates(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          What would you like to research?
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Enter a topic and I'll search multiple sources, analyze the content, and generate a comprehensive report.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Research Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Research Mode
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {RESEARCH_MODES.map((mode) => (
              <motion.button
                key={mode.id}
                type="button"
                onClick={() => setSelectedMode(mode.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedMode === mode.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                <div className="text-2xl mb-2">{mode.icon}</div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  {mode.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {mode.description}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Query Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="query" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Research Topic
            </label>
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Use Template
            </button>
          </div>

          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QUERY_TEMPLATES.map((template) => (
                  <button
                    key={template.label}
                    type="button"
                    onClick={() => applyTemplate(template.placeholder)}
                    className="px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors text-left"
                  >
                    <div className="font-medium text-slate-900 dark:text-white">{template.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{template.placeholder}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white resize-none"
            placeholder="e.g., What are the latest developments in quantum computing? or Explain the impact of AI on healthcare diagnostics..."
            required
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {query.length} characters
            </span>
            {query.length > 0 && query.length < 20 && (
              <span className="text-xs text-orange-500">
                💡 Try to be more specific for better results
              </span>
            )}
          </div>
        </div>

        {/* Advanced Options */}
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Advanced Options
          </summary>
          <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl space-y-3">
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400">Max Results</label>
              <input
                type="range"
                min="5"
                max="20"
                defaultValue="15"
                className="w-full mt-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="deep-research" className="rounded" />
              <label htmlFor="deep-research" className="text-sm text-slate-600 dark:text-slate-400">
                Enable deep research (slower but more thorough)
              </label>
            </div>
          </div>
        </details>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Start Research
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </motion.button>
      </form>

      {/* Tips */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tips for better results:
            </p>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
              <li>• Be specific with your query (50-200 characters recommended)</li>
              <li>• Choose the appropriate research mode for your topic</li>
              <li>• Use templates for common research patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
