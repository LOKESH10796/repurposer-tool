/**
 * CSV Drop Zone Component
 * Accessible drag-and-drop file upload with validation feedback
 */

'use client';

import { useCallback, useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CsvDropZoneProps {
  onFileSelect: (file: File) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  showInstructions?: boolean;
}

export function CsvDropZone({
  onFileSelect,
  onError,
  disabled = false,
  acceptedTypes = ['.csv', 'text/csv', 'application/csv'],
  maxSizeMB = 50,
  showInstructions = true,
}: CsvDropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    // Check type
    const isValidType = acceptedTypes.some(type => 
      type.startsWith('.') ? file.name.toLowerCase().endsWith(type) : file.type === type
    );
    if (!isValidType) {
      return `Please select a CSV file. Selected: ${file.name}`;
    }

    // Check size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: ${maxSizeMB}MB`;
    }

    return null;
  }, [acceptedTypes, maxSizeMB]);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      onError?.(error);
      return;
    }

    setIsProcessing(true);
    onFileSelect(file);
    
    // Reset processing state after a delay (actual processing happens in parent)
    setTimeout(() => setIsProcessing(false), 1000);
  }, [validateFile, onFileSelect, onError]);

  // Drag events
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragActive(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }, [disabled]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [disabled, handleFileSelect]);

  // Click to browse
  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  // File input change
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  }, [handleFileSelect]);

  // Keyboard accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Upload CSV file"
        disabled={disabled}
        tabIndex={-1}
      />

      {/* Main drop zone */}
      <div
        ref={dropZoneRef}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={disabled ? 'File upload disabled' : 'Drop zone for CSV file. Click or drag and drop to upload.'}
        className={cn(
          'relative rounded-2xl border-2 transition-all duration-200',
          'flex flex-col items-center justify-center p-8 text-center',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed dark:border-gray-700 dark:bg-gray-900/50'
            : isDragActive
            ? 'border-primary bg-primary/5 dark:bg-primary/10'
            : 'border-gray-200 bg-gray-50/50 hover:border-primary/50 hover:bg-primary/5 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-primary/50 dark:hover:bg-primary/10'
        )}
      >
        {/* Upload icon */}
        <div className={cn(
          'mb-4 transition-transform duration-200',
          isDragActive && !disabled ? 'scale-110 text-primary' : 'text-gray-400'
        )}>
          <Upload className="w-12 h-12" strokeWidth={1.5} />
        </div>

        {/* Main text */}
        <div className="space-y-2">
          <p className={cn(
            'text-lg font-medium',
            disabled ? 'text-gray-400' : 'text-gray-900 dark:text-gray-100'
          )}>
            {isDragActive ? 'Drop your CSV here' : 'Upload LinkedIn Posts.csv'}
          </p>
          
          <p className={cn(
            'text-sm',
            disabled ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
          )}>
            {isProcessing 
              ? 'Processing...' 
              : 'Drag and drop, click to browse, or paste (Ctrl+V)'}
          </p>
        </div>

        {/* Instructions */}
        {showInstructions && !isDragActive && !isProcessing && (
          <div className="mt-6 w-full max-w-sm">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-left dark:border-gray-700 dark:bg-gray-800/50">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                How to get your LinkedIn data:
              </p>
              <ol className="text-xs text-gray-700 space-y-1 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  LinkedIn Settings → <strong>Data Privacy</strong>
                </li>
                <li className="flex items-center gap-2 ml-6">
                  <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <strong>Get a copy of your data</strong>
                </li>
                <li className="flex items-center gap-2 ml-6">
                  <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  Check <strong>Posts</strong> → Request archive
                </li>
                <li className="flex items-center gap-2 ml-6">
                  <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">4</span>
                  Download email → Extract <strong>Posts.csv</strong> → Upload here
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Privacy badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span>This file never leaves your browser</span>
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span>100% local processing</span>
        </div>

        {/* File requirements */}
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
          <FileText className="w-3 h-3 inline-block mr-1" />
          CSV only • Max {maxSizeMB}MB • Columns: Post URL, Post Text, Post Date, Post Type (+ optional metrics)
        </div>
      </div>

      {/* Error toast */}
      {/* Error handled by parent via onError callback */}
    </div>
  );
}

// Paste handler hook
export function usePasteFile(onPasteFile: (file: File) => void) {
  useCallback(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.kind === 'file' && item.type === 'text/csv') {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            onPasteFile(file);
            break;
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [onPasteFile]);
}