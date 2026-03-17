import { motion } from 'framer-motion'
import type { Source } from 'shared'

interface AnimatedSourceCardProps {
  source: Source
  index: number
  isExtracting?: boolean
  extractionSuccess?: boolean
}

export default function AnimatedSourceCard({ 
  source, 
  index, 
  isExtracting = false,
  extractionSuccess 
}: AnimatedSourceCardProps) {
  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'wikipedia':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127 1.907-1.532 2.499-.405.591-.78.92-1.124.985-.344.066-.557-.035-.641-.302-.084-.267.084-.657.503-1.17.42-.512.997-1.268 1.735-2.268.737-1.001 1.567-2.209 2.489-3.625.922-1.417 1.816-2.812 2.683-4.186.867-1.374 1.627-2.573 2.28-3.598.653-1.025 1.119-1.795 1.397-2.312.278-.517.417-.776.417-.776s.139.259.417.776c.278.517.744 1.287 1.397 2.312.653 1.025 1.413 2.224 2.28 3.598.867 1.374 1.761 2.769 2.683 4.186.922 1.416 1.752 2.624 2.489 3.625.738 1 1.315 1.756 1.735 2.268.419.513.587.903.503 1.17-.084.267-.297.368-.641.302-.344-.065-.719-.394-1.124-.985-.405-.592-.916-1.425-1.532-2.499-.636-1.18-1.917-3.796-2.853-5.728z"/>
          </svg>
        )
      case 'news':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        )
      case 'academic':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        )
    }
  }

  const getSourceColor = (sourceType: string) => {
    switch (sourceType) {
      case 'wikipedia':
        return 'from-gray-500 to-gray-600'
      case 'news':
        return 'from-orange-500 to-red-500'
      case 'academic':
        return 'from-purple-500 to-indigo-500'
      default:
        return 'from-blue-500 to-cyan-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      className="relative"
    >
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 hover:shadow-lg group"
      >
        {/* Extraction Status Indicator */}
        {isExtracting && (
          <motion.div
            className="absolute top-2 right-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {extractionSuccess === undefined ? (
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            ) : extractionSuccess ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            ) : (
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </motion.div>
        )}

        <div className="flex items-start gap-3">
          {/* Source Icon */}
          <motion.div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getSourceColor(source.source)} flex items-center justify-center text-white flex-shrink-0`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {getSourceIcon(source.source)}
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2 mb-1 transition-colors">
              {source.title}
            </h4>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
              {source.snippet}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full capitalize">
                {source.source}
              </span>
              <span className="truncate">
                {new URL(source.url).hostname.replace('www.', '')}
              </span>
            </div>
          </div>

          {/* Arrow Icon */}
          <motion.div
            className="text-slate-400 group-hover:text-primary-500 transition-colors"
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>
      </a>
    </motion.div>
  )
}
