// Web Worker Hook for Voice DNA Extraction
// Manages worker lifecycle, message passing, and progress tracking

import { useState, useCallback, useEffect, useRef } from 'react';
import { VoiceDNA, NormalizedPost } from '@/types/voice-dna';

interface WorkerMessage {
  type: 'EXTRACT' | 'PING';
  data?: { posts: NormalizedPost[] };
}

interface WorkerResponse {
  type: 'PROGRESS' | 'RESULT' | 'ERROR' | 'PONG' | 'READY';
  stage?: string;
  progress?: number;
  message?: string;
  data?: VoiceDNA;
  error?: string;
}

interface UseVoiceDnaWorkerReturn {
  voiceDNA: VoiceDNA | null;
  loading: boolean;
  error: string | null;
  progress: number;
  stage: string;
  stageMessage: string;
  extractVoiceDNA: (posts: NormalizedPost[]) => Promise<VoiceDNA>;
  cancel: () => void;
  reset: () => void;
}

export function useVoiceDnaWorker(): UseVoiceDnaWorkerReturn {
  const [voiceDNA, setVoiceDNA] = useState<VoiceDNA | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('idle');
  const [stageMessage, setStageMessage] = useState('');
  
  const workerRef = useRef<Worker | null>(null);
  const resolveRef = useRef<((dna: VoiceDNA) => void) | null>(null);
  const rejectRef = useRef<((err: Error) => void) | null>(null);

  // Initialize worker
  useEffect(() => {
    // Only create worker in browser environment
    if (typeof window === 'undefined') return;

    try {
      // Create worker from the public/workers path
      workerRef.current = new Worker('/workers/voice-dna-worker.js', { type: 'module' });
      
      workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const { type, stage: msgStage, progress: msgProgress, message, data, error: workerError } = event.data;
        
        switch (type) {
          case 'READY':
            console.log('[VoiceDNA Worker] Ready');
            break;
            
          case 'PROGRESS':
            setStage(msgStage || 'unknown');
            setProgress(msgProgress || 0);
            setStageMessage(message || '');
            break;
            
          case 'RESULT':
            if (data) {
              setVoiceDNA(data);
              setLoading(false);
              resolveRef.current?.(data);
              resolveRef.current = null;
              rejectRef.current = null;
            }
            break;
            
          case 'ERROR':
            const err = new Error(workerError || 'Worker error');
            setError(workerError || 'Unknown worker error');
            setLoading(false);
            rejectRef.current?.(err);
            resolveRef.current = null;
            rejectRef.current = null;
            break;
            
          case 'PONG':
            console.log('[VoiceDNA Worker] Pong');
            break;
        }
      };
      
      workerRef.current.onerror = (err) => {
        console.error('[VoiceDNA Worker] Error:', err);
        setError(`Worker error: ${err.message}`);
        setLoading(false);
        rejectRef.current?.(new Error(err.message));
        resolveRef.current = null;
        rejectRef.current = null;
      };
      
    } catch (err) {
      console.error('[VoiceDNA Worker] Failed to create:', err);
      setError('Failed to initialize Web Worker. Web Workers may not be supported.');
    }
    
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const extractVoiceDNA = useCallback(async (posts: NormalizedPost[]): Promise<VoiceDNA> => {
    if (!workerRef.current) {
      throw new Error('Web Worker not initialized');
    }
    
    if (loading) {
      throw new Error('Extraction already in progress');
    }
    
    // Validate posts
    if (!posts || posts.length === 0) {
      throw new Error('No posts provided for extraction');
    }
    
    setLoading(true);
    setError(null);
    setProgress(0);
    setStage('starting');
    setStageMessage('Initializing extraction...');
    
    return new Promise((resolve, reject) => {
      resolveRef.current = resolve;
      rejectRef.current = reject;
      
      // Send extraction request to worker
      workerRef.current!.postMessage({
        type: 'EXTRACT',
        data: { posts }
      } as WorkerMessage);
      
      // Timeout after 5 minutes
      setTimeout(() => {
        if (loading) {
          setLoading(false);
          setError('Extraction timed out (5 minutes)');
          reject(new Error('Extraction timed out'));
          resolveRef.current = null;
          rejectRef.current = null;
        }
      }, 5 * 60 * 1000);
    });
  }, [loading]);

  const cancel = useCallback(() => {
    if (workerRef.current && loading) {
      workerRef.current.terminate();
      workerRef.current = null;
      setLoading(false);
      setError('Extraction cancelled');
      rejectRef.current?.(new Error('Cancelled by user'));
      resolveRef.current = null;
      rejectRef.current = null;
    }
  }, [loading]);

  const reset = useCallback(() => {
    setVoiceDNA(null);
    setLoading(false);
    setError(null);
    setProgress(0);
    setStage('idle');
    setStageMessage('');
  }, []);

  return {
    voiceDNA,
    loading,
    error,
    progress,
    stage,
    stageMessage,
    extractVoiceDNA,
    cancel,
    reset
  };
}

// Utility to load Voice DNA from sessionStorage
export function useVoiceDnaStorage() {
  const loadFromSessionStorage = useCallback((): VoiceDNA | null => {
    try {
      const stored = sessionStorage.getItem('voiceDNA');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const saveToSessionStorage = useCallback((dna: VoiceDNA) => {
    try {
      sessionStorage.setItem('voiceDNA', JSON.stringify(dna));
    } catch (err) {
      console.error('Failed to save Voice DNA:', err);
    }
  }, []);

  return { loadFromSessionStorage, saveToSessionStorage };
}