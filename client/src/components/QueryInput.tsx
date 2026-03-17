import type { ResearchQuery } from 'shared'

interface QueryInputProps {
  onSubmit: (query: ResearchQuery) => void
}

export default function QueryInput({ onSubmit }: QueryInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('query') as string

    if (query.trim()) {
      onSubmit({
        query: query.trim(),
        sources: ['web', 'wikipedia'],
        maxResults: 10
      })
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          What would you like to research?
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Enter a topic and I'll search multiple sources, analyze the content, and generate a comprehensive report.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Research Topic
          </label>
          <textarea
            id="query"
            name="query"
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white resize-none"
            placeholder="e.g., What are the latest developments in quantum computing? or Explain the impact of AI on healthcare diagnostics..."
            required
          />
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Sources to search:
          </h3>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">Web Search</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">Wikipedia</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">News</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Start Research
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-medium">Tip:</span> Be specific with your query for better results. You can ask about any topic, technology, concept, or current event.
        </p>
      </div>
    </div>
  )
}