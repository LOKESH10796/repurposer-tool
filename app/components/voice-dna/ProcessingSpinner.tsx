/**
 * Processing Spinner Component
 * Engaging loading states for Voice DNA analysis
 */

'use client';

import { useEffect, useState } from 'react';
import { Loader2, Brain, Zap, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingSpinnerProps {
  stage: 'idle' | 'parsing' | 'validating' | 'extracting' | 'modeling' | 'complete' | 'error';
  progress: number; // 0-100
  message?: string;
  postsProcessed?: number;
  totalPosts?: number;
  className?: string;
  onComplete?: () => void;
}

const STAGES = [
  { id: 'parsing', label: 'Reading CSV', icon: Loader2, description: 'Parsing your LinkedIn export...' },
  { id: 'validating', label: 'Validating data', icon: CheckCircle2, description: 'Checking columns & formats...' },
  { id: 'extracting', label: 'Extracting patterns', icon: Zap, description: 'Finding your voice signatures...' },
  { id: 'modeling', label: 'Building Voice DNA', icon: Brain, description: 'AI analyzing your content style...' },
  { id: 'complete', label: 'Ready!', icon: Sparkles, description: 'Your Voice DNA is complete' },
] as const;

type StageId = typeof STAGES[number]['id'];

export function ProcessingSpinner({
  stage,
  progress,
  message,
  postsProcessed,
  totalPosts,
  className,
  onComplete,
}: ProcessingSpinnerProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  // Auto-advance stages based on progress
  useEffect(() => {
    if (stage === 'idle') {
      setCurrentStageIndex(0);
      setShowComplete(false);
      return;
    }

    if (stage === 'error') return;

    const stageIndex = STAGES.findIndex(s => s.id === stage);
    if (stageIndex !== -1) {
      setCurrentStageIndex(stageIndex);
    }

    if (stage === 'complete') {
      setShowComplete(true);
      onComplete?.();
    }
  }, [stage, onComplete]);

  const currentStage = STAGES[currentStageIndex];
  const completedStages = STAGES.slice(0, currentStageIndex);
  const isCurrentStageActive = stage !== 'complete' && stage !== 'error' && stage !== 'idle';

  return (
    <div className={cn('space-y-6', className)}>
      {/* Stage progress indicator */}
      <div className="hidden md:flex items-center justify-center gap-2" role="status" aria-live="polite">
        {STAGES.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            {i > 0 && (
              <div className={cn(
                'w-16 h-0.5 rounded flex-shrink-0 transition-colors',
                i <= currentStageIndex ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
              )} />
            )}
            <div className={cn(
              'flex flex-col items-center gap-1 transition-all duration-300',
              i < currentStageIndex ? 'text-primary' :
              i === currentStageIndex && isCurrentStageActive ? 'text-primary' :
              'text-gray-400 dark:text-gray-600'
            )}>
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                i < currentStageIndex ? 'bg-primary border-primary text-white' :
                i === currentStageIndex && isCurrentStageActive ? 'border-primary bg-primary/10' :
                'border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800'
              )}>
                {i < currentStageIndex ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <currentStage.icon className={cn('w-4 h-4', i === currentStageIndex && isCurrentStageActive ? 'text-primary' : 'text-gray-400')} />
                )}
              </div>
              <span className="text-xs font-medium whitespace-nowrap">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile simplified progress */}
      <div className="md:hidden space-y-3" role="status" aria-live="polite">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-900 dark:text-gray-100">{currentStage.label}</span>
          <span className="text-gray-500 dark:text-gray-400">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {currentStage.description}
        </p>
      </div>

      {/* Main animated area */}
      <div className="flex flex-col items-center justify-center gap-6 py-8">
        {/* Animated icon */}
        <div className="relative">
          {/* Pulsing rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'absolute rounded-full border-2 border-primary/20 animate-pulse',
                  'origin-center'
                )}
                style={{
                  width: `calc(100% + ${i * 24}px)`,
                  height: `calc(100% + ${i * 24}px)`,
                  animationDelay: `${i * 300}ms`,
                }}
              />
            ))}
          </div>

          {/* Center icon */}
          <div className={cn(
            'relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500',
            isCurrentStageActive ? 'bg-primary/10 animate-pulse' : 'bg-gray-100 dark:bg-gray-800'
          )}>
            {/* Render dynamic component */}
            <currentStage.icon 
              className={cn('w-10 h-10 transition-colors duration-300',
                isCurrentStageActive ? 'text-primary' : 'text-gray-400'
              )} 
              strokeWidth={1.5} 
            />
          </div>
        </div>

        {/* Stage info */}
        <div className="text-center space-y-2">
          <h3 className={cn(
            'text-xl font-semibold transition-colors duration-300',
            stage === 'error' ? 'text-red-600 dark:text-red-400' :
            stage === 'complete' ? 'text-green-600 dark:text-green-400' :
            'text-gray-900 dark:text-gray-100'
          )}>
            {message || currentStage.label}
          </h3>
          
          <p className={cn(
            'text-sm transition-colors duration-300',
            stage === 'error' ? 'text-red-500 dark:text-red-500' :
            'text-gray-600 dark:text-gray-400'
          )}>
            {stage === 'complete' 
              ? currentStage.description 
              : currentStage.description}
          </p>

          {/* Post counter */}
          {postsProcessed !== undefined && totalPosts !== undefined && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>Processed</span>
              <span className="font-mono font-medium text-primary">{postsProcessed.toLocaleString()}</span>
              <span>/</span>
              <span className="font-mono">{totalPosts.toLocaleString()}</span>
              <span>posts</span>
            </div>
          )}

          {/* Progress bar (desktop) */}
          <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4 mx-auto hidden md:block">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Fun facts during processing */}
        {isCurrentStageActive && stage === 'modeling' && (
          <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 max-w-md text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-primary">Did you know?</span>{' '}
              Your writing style is as unique as a fingerprint — we're mapping yours right now.
            </p>
          </div>
        )}

        {isCurrentStageActive && stage === 'extracting' && (
          <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 max-w-md text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-primary">Analyzing...</span>{' '}
              Hook patterns, topic pillars, posting rhythm, vocabulary — all locally in your browser.
            </p>
          </div>
        )}
      </div>

      {/* Complete state */}
      {showComplete && stage === 'complete' && (
        <div className="flex flex-col items-center gap-4 py-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Your Voice DNA is ready
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              We analyzed {totalPosts?.toLocaleString() || postsProcessed?.toLocaleString() || 'your'} posts
              and built your unique content profile.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-primary font-medium">
            <ArrowRight className="w-5 h-5 animate-bounce" />
            <span>View your profile →</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {stage === 'error' && (
        <div className="flex flex-col items-center gap-4 py-4 animate-shake">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">
              Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-md">
              {message || 'We couldn\'t process your file. Please check the format and try again.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact inline version for smaller spaces
export function InlineProcessingSpinner({
  stage,
  progress,
  message,
  className,
}: Pick<ProcessingSpinnerProps, 'stage' | 'progress' | 'message' | 'className'>) {
  const currentStage = STAGES.find(s => s.id === stage) || STAGES[0];
  const isActive = stage !== 'complete' && stage !== 'error' && stage !== 'idle';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-spin" />
        <currentStage.icon className={cn('absolute inset-0 w-5 h-5 mx-auto my-auto transition-colors',
          isActive ? 'text-primary' : 'text-gray-400'
        )} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {message || currentStage.label}
        </p>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400 w-10 text-right">
        {progress}%
      </span>
    </div>
  );
}
