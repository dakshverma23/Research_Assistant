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
      className="bg-white rounded-3xl shadow-xl border-2 border-indigo-100 p-8 sm:p-10"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          What would you like to research?
        </h2>
        <p className="text-slate-600 text-lg">
          Enter a topic and I'll search multiple sources, analyze the content, and generate a comprehensive report.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Research Mode Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-4">
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
                className={`p-5 rounded-2xl border-2 transition-all ${
                  selectedMode === mode.id
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                <div className="text-3xl mb-2">{mode.icon}</div>
                <div className="text-sm font-bold text-slate-900">
                  {mode.name}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {mode.description}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Query Input */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="query" className="block text-sm font-semibold text-slate-700">
              Research Topic
            </label>
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
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
              className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-indigo-100"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QUERY_TEMPLATES.map((template) => (
                  <button
                    key={template.label}
                    type="button"
                    onClick={() => applyTemplate(template.placeholder)}
                    className="px-4 py-3 text-sm bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all text-left"
                  >
                    <div className="font-bold text-slate-900">{template.label}</div>
                    <div className="text-xs text-slate-600 truncate mt-0.5">{template.placeholder}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
            className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 bg-white text-slate-900 resize-none text-base"
            placeholder="e.g., What are the latest developments in quantum computing? or Explain the impact of AI on healthcare diagnostics..."
            required
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-slate-500 font-medium">
              {query.length} characters
            </span>
            {query.length > 0 && query.length < 20 && (
              <span className="text-sm text-orange-600 font-medium">
                💡 Try to be more specific for better results
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-8 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Start Research
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </motion.button>
      </form>

      {/* Tips */}
      <div className="mt-8 pt-6 border-t-2 border-slate-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-bold text-slate-800 mb-2">
              Tips for better results:
            </p>
            <ul className="text-sm text-slate-600 space-y-1.5 leading-relaxed">
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
