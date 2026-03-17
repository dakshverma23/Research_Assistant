import { motion, AnimatePresence } from 'framer-motion'
import type { ResearchProgress } from 'shared'
import AnimatedSourceCard from './AnimatedSourceCard'

interface ProgressIndicatorProps {
  progress: ResearchProgress
}

export default function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  const stages = ['analyzing', 'searching', 'extracting', 'synthesizing', 'generating']
  const currentIndex = stages.indexOf(progress.stage)

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8"
      >
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Researching Your Topic
            </h2>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full"
            />
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            {progress.message}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
            <span>Progress</span>
            <motion.span
              key={progress.progress}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="font-semibold text-primary-600 dark:text-primary-400"
            >
              {progress.progress}%
            </motion.span>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress.progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Stage Progress */}
        <div className="space-y-3">
          {stages.map((stage, index) => {
            const isComplete = currentIndex > index
            const isCurrent = currentIndex === index

            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                    : isComplete
                    ? 'bg-accent-50 dark:bg-accent-900/20'
                    : 'bg-slate-50 dark:bg-slate-700/50'
                }`}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCurrent
                      ? 'bg-primary-500 text-white'
                      : isComplete
                      ? 'bg-accent-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-400'
                  }`}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {isComplete ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </motion.div>
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    isCurrent
                      ? 'text-primary-700 dark:text-primary-300'
                      : isComplete
                      ? 'text-accent-700 dark:text-accent-300'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </h3>
                  {isCurrent && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {progress.message}
                    </p>
                  )}
                </div>
                {isCurrent && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full"
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Live Sources Preview */}
      {progress.sources && progress.sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Sources Found
            </h3>
            <span className="px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full text-sm font-semibold">
              {progress.sources.length}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <AnimatePresence>
              {progress.sources.map((source, index) => (
                <AnimatedSourceCard
                  key={source.id}
                  source={source}
                  index={index}
                  isExtracting={progress.stage === 'extracting'}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  )
}
