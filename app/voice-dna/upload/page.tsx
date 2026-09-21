/**
 * Voice DNA Upload Page
 * Complete flow: CSV upload → parse → extract → preview
 * Self-contained with inline components (no external UI imports)
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Download, ArrowRight, RefreshCw, AlertTriangle, Info, Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { parseCSVSync, generateTemplateCSV, estimateProcessingTime } from '@/lib/csv-parser';
import { mockVoiceDna } from '@/lib/mock-voice-dna';
import { useCsvParser } from '@/hooks/useCsvParser';
import { useVoiceDna } from '@/hooks/useVoiceDna';
import type { NormalizedPost, VoiceDNA } from '@/types/voice-dna';
import type { ValidationResult, ValidationError, ValidationWarning } from '@/lib/linkedin-csv-schema';

const STORAGE_KEY = 'reframe-voice-dna';

// Inline CsvDropZone Component
function CsvDropZone({ 
  onFileSelect, 
  onError, 
  disabled, 
  showInstructions 
}: { 
  onFileSelect: (file: File) => void;
  onError: (error: string | null) => void;
  disabled: boolean;
  showInstructions: boolean;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setIsLoading(true);
        onError(null);
        onFileSelect(file);
        setIsLoading(false);
      } else {
        onError('Please upload a CSV file.');
      }
    }
  }, [disabled, onFileSelect, onError]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setIsLoading(true);
        onError(null);
        onFileSelect(file);
        setIsLoading(false);
      } else {
        onError('Please upload a CSV file.');
      }
    }
  }, [onFileSelect, onError]);

  return (
    <div className="relative">
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileInput}
        disabled={disabled || isLoading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="csv-upload"
      />
      
      <label
        htmlFor="csv-upload"
        className={`block border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-200 ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`relative p-4 rounded-2xl ${isDragOver ? 'bg-primary/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
            <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isLoading ? 'Processing...' : 'Drop your LinkedIn Posts.csv here'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {isLoading 
                ? 'Analyzing your content...' 
                : 'Or click to browse. We\'ll analyze your voice locally in your browser.'
              }
            </p>
          </div>

          {showInstructions && (
            <div className="w-full max-w-md mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 text-left">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                How to export your LinkedIn posts:
              </h4>
              <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li className="flex items-start gap-2"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">1</span>Go to <a href="https://www.linkedin.com/settings/data-export" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn Data Export</a></li>
                <li className="flex items-start gap-2"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">2</span>Select "Posts" and request archive</li>
                <li className="flex items-start gap-2"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">3</span>Download and unzip the archive</li>
                <li className="flex items-start gap-2"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">4</span>Upload the <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">Posts.csv</code> file</li>
              </ol>
            </div>
          )}
        </div>
      </label>
    </div>
  );
}

// Inline ProcessingSpinner Component
function ProcessingSpinner({ 
  stage, 
  progress, 
  message, 
  postsProcessed, 
  totalPosts,
  className = ''
}: { 
  stage: string;
  progress: number;
  message: string;
  postsProcessed: number;
  totalPosts: number;
  className?: string;
}) {
  const stages = [
    { id: 'parsing', label: 'Reading CSV', icon: FileText },
    { id: 'validating', label: 'Validating Data', icon: CheckCircle },
    { id: 'extracting', label: 'Extracting Patterns', icon: AlertTriangle },
    { id: 'modeling', label: 'Building Profile', icon: Loader2 },
    { id: 'complete', label: 'Complete', icon: CheckCircle },
    { id: 'error', label: 'Error', icon: XCircle },
  ];

  const currentStageIndex = stages.findIndex(s => s.id === stage);
  const StageIcon = stages[currentStageIndex]?.icon || Loader2;

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="text-center mb-8">
        <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-full ${
          stage === 'error' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-primary/10'
        }`}>
          <StageIcon className={`w-10 h-10 ${stage === 'error' ? 'text-red-500' : 'text-primary'}`} />
          {stage !== 'complete' && stage !== 'error' && (
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          )}
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          {stages[currentStageIndex]?.label || 'Processing...'}
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500 dark:text-gray-400">{message}</span>
          <span className="font-mono font-medium text-primary">{progress}%</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              stage === 'error' ? 'bg-red-500' : 'bg-primary'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="flex items-center justify-between text-xs">
        {stages.slice(0, 5).map((s, i) => (
          <div key={s.id} className="flex flex-col items-center gap-1 relative">
            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
              i < currentStageIndex 
                ? 'bg-primary text-white' 
                : i === currentStageIndex && stage !== 'complete' && stage !== 'error'
                  ? 'bg-primary/10 text-primary ring-2 ring-primary'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
            }`}>
              {i < currentStageIndex ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="font-medium">{i + 1}</span>
              )}
            </div>
            <span className={`font-medium ${
              i <= currentStageIndex ? 'text-gray-900 dark:text-white' : 'text-gray-400'
            }`}>
              {s.label}
            </span>
            {i < 4 && (
              <div className={`absolute top-4 left-1/2 w-full h-0.5 -translate-x-1/2 ${
                i < currentStageIndex ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Stats */}
      {totalPosts > 0 && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-center justify-around text-sm">
          <div className="text-center">
            <div className="font-mono font-bold text-xl text-primary">{postsProcessed.toLocaleString()}</div>
            <div className="text-gray-500 dark:text-gray-400">Processed</div>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <div className="font-mono font-bold text-xl text-gray-900 dark:text-white">{totalPosts.toLocaleString()}</div>
            <div className="text-gray-500 dark:text-gray-400">Total Posts</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VoiceDnaUploadPage() {
  const { isParsing, error: parseError, parseCSV } = useCsvParser();
  const { voiceDNA, loading: dnaLoading, extractVoiceDNA } = useVoiceDna();
  const [stage, setStage] = useState<'idle' | 'parsing' | 'validating' | 'extracting' | 'modeling' | 'complete' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [postsProcessed, setPostsProcessed] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [posts, setPosts] = useState<NormalizedPost[]>([]);
  const [showTemplate, setShowTemplate] = useState(false);

  // Estimate processing time for UI
  const estimate = estimateProcessingTime(150); // Default estimate

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setStage('parsing');
    setProgress(5);
    setMessage('Reading CSV file...');
    
    try {
      // Use the new useCsvParser hook
      const posts = await parseCSV(file);
      
      setStage('validating');
      setProgress(15);
      setMessage('Validating columns & format...');
      
      // Parse with our utility
      const text = await file.text();
      const result = parseCSVSync(text, { maxRows: 10000 });
      
      setValidation(result.validation);
      setPosts(result.posts);
      setTotalPosts(result.posts.length);
      setPostsProcessed(result.posts.length);
      
      if (result.posts.length === 0) {
        throw new Error('No valid posts found in CSV. Please check the file format.');
      }
      
      if (!result.validation.valid && result.validation.errors.length > 0) {
        const criticalErrors = result.validation.errors.filter((e: ValidationError) => 
          e.field === 'Post Date' || e.field === 'Post URL'
        );
        if (criticalErrors.length > result.posts.length * 0.5) {
          throw new Error(`Too many invalid rows (${criticalErrors.length}/${result.validation.stats.totalRows}). Please check your CSV format.`);
        }
      }
      
      // Simulate extraction stages with realistic timing
      await simulateExtraction(result.posts.length);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file. Please try again.';
      setError(errorMessage);
      setStage('error');
      setMessage(errorMessage);
    }
  }, [parseCSV]);

  const simulateExtraction = async (postCount: number) => {
    const stages = [
      { stage: 'extracting' as const, progress: 35, message: 'Extracting patterns from posts...', duration: 800 },
      { stage: 'modeling' as const, progress: 60, message: 'Building Voice DNA profile...', duration: 1500 },
      { stage: 'modeling' as const, progress: 85, message: 'Analyzing tone, hooks & pillars...', duration: 1000 },
      { stage: 'complete' as const, progress: 100, message: 'Voice DNA ready!', duration: 500 },
    ];

    for (const s of stages) {
      setStage(s.stage);
      setProgress(s.progress);
      setMessage(s.message);
      setPostsProcessed(postCount);
      await new Promise(r => setTimeout(r, s.duration));
    }

    // Extract Voice DNA using the new extractor
    const voiceDna = await extractVoiceDNA(posts);
    
    // Store in sessionStorage for preview page
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(voiceDna));
    } catch (e) {
      console.warn('Failed to store Voice DNA:', e);
    }

    setStage('complete');
    
    // Redirect after brief celebration
    setTimeout(() => {
      window.location.href = '/voice-dna/preview';
    }, 1500);
  };

  const handleRetry = useCallback(() => {
    setStage('idle');
    setProgress(0);
    setMessage('');
    setError(null);
    setValidation(null);
    setPosts([]);
    setPostsProcessed(0);
    setTotalPosts(0);
  }, []);

  const downloadTemplate = useCallback(() => {
    const csv = generateTemplateCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'LinkedIn-Posts-Template.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }, []);

  // Keyboard paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (stage !== 'idle') return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.kind === 'file' && item.type === 'text/csv') {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            handleFileSelect(file);
            break;
          }
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [stage, handleFileSelect]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent dark:from-primary/10 pointer-events-none" />
      
      <main className="relative max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>Beta: Voice DNA Analysis</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Make Reframe sound like <span className="text-primary">YOU</span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload your LinkedIn <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">Posts.csv</code> — 
            we&apos;ll analyze your voice locally in your browser and build your unique content profile.
          </p>
        </header>

        {/* Privacy Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <span>Never leaves your browser</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>100% local processing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            <span>No training on your data</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          
          {/* Upload Zone */}
          {stage === 'idle' && (
            <div className="p-8 md:p-12">
              <CsvDropZone
                onFileSelect={handleFileSelect}
                onError={setError}
                disabled={stage !== 'idle'}
                showInstructions={true}
              />
              
              {/* Template Download */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download CSV Template
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Use this if your export format differs
                </span>
              </div>
            </div>
          )}

          {/* Processing State */}
          {(stage !== 'idle' && stage !== 'complete' && stage !== 'error') && (
            <div className="p-8 md:p-12">
              <ProcessingSpinner
                stage={stage}
                progress={progress}
                message={message}
                postsProcessed={postsProcessed}
                totalPosts={totalPosts}
                className="max-w-md mx-auto"
              />
            </div>
          )}

          {/* Complete State - Brief before redirect */}
          {stage === 'complete' && (
            <div className="p-8 md:p-12 text-center">
              <ProcessingSpinner
                stage="complete"
                progress={100}
                message="Voice DNA ready!"
                postsProcessed={postsProcessed}
                totalPosts={totalPosts}
                className="max-w-md mx-auto"
              />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Redirecting to your Voice DNA profile...
              </p>
            </div>
          )}

          {/* Error State */}
          {stage === 'error' && (
            <div className="p-8 md:p-12">
              <ProcessingSpinner
                stage="error"
                progress={0}
                message={message}
                postsProcessed={postsProcessed}
                totalPosts={totalPosts}
                className="max-w-md mx-auto"
              />
              <div className="mt-6 text-center">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Need help? Check the template format or 
                  <a href="#" className="text-primary hover:underline">contact support</a>
                </p>
              </div>
            </div>
          )}

          {/* Validation Warnings (Non-blocking) */}
          {validation && validation.warnings.length > 0 && stage !== 'error' && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    {validation.warnings.length} warning{validation.warnings.length !== 1 ? 's' : ''} during parsing
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Most rows processed successfully. Common issues: empty post text, missing engagement metrics.
                  </p>
                  <details className="mt-2">
                    <summary className="text-xs font-medium text-yellow-700 dark:text-yellow-300 cursor-pointer">
                      Show details
                    </summary>
                    <ul className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 space-y-1 max-h-40 overflow-auto">
                      {validation.warnings.slice(0, 10).map((w, i) => (
                        <li key={i}>Row {w.row}: {w.field} — {w.message}</li>
                      ))}
                      {validation.warnings.length > 10 && (
                        <li>... and {validation.warnings.length - 10} more</li>
                      )}
                    </ul>
                  </details>
                </div>
              </div>
            </div>
          )}

          {/* Stats Bar (when posts loaded) */}
          {posts.length > 0 && stage !== 'idle' && (
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span className="font-mono font-bold text-lg text-primary">{posts.length.toLocaleString()}</span>
                  <span>posts loaded</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Info className="w-4 h-4" />
                  <span>Estimated processing: {estimate.humanReadable}</span>
                </div>
              </div>
              {validation?.stats.dateRange && (
                <div className="text-gray-500 dark:text-gray-400">
                  Date range: {validation.stats.dateRange.earliest.toLocaleDateString()} – {validation.stats.dateRange.latest.toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            By uploading, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>{' '}
            &{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            . Your data is processed locally and never sent to our servers.
          </p>
        </footer>
      </main>
    </div>
  );
}