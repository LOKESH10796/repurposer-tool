// Voice DNA State Management Hook - Uses Web Worker for real extraction
// Version: 2.0.0 - Real Transformers.js Integration
// Last Updated: 2026-08-30

import { useState, useCallback, useEffect } from 'react';
import { VoiceDNA, NormalizedPost } from '@/types/voice-dna';
import { useVoiceDnaWorker, useVoiceDnaStorage } from './useVoiceDnaWorker';

export function useVoiceDna() {
  const {
    voiceDNA: workerDNA,
    loading,
    error,
    progress,
    stage,
    stageMessage,
    extractVoiceDNA,
    cancel,
    reset: resetWorker
  } = useVoiceDnaWorker();

  const { loadFromSessionStorage, saveToSessionStorage } = useVoiceDnaStorage();
  
  // Merge worker DNA with sessionStorage DNA (worker takes priority when loading)
  const [voiceDNA, setVoiceDNA] = useState<VoiceDNA | null>(() => {
    if (typeof window !== 'undefined') {
      return loadFromSessionStorage();
    }
    return null;
  });

  // Sync with worker DNA when it completes
  useEffect(() => {
    if (workerDNA) {
      setVoiceDNA(workerDNA);
      saveToSessionStorage(workerDNA);
    }
  }, [workerDNA, saveToSessionStorage]);

  const extractVoiceDNAWrapper = useCallback(async (posts: NormalizedPost[]): Promise<VoiceDNA> => {
    setVoiceDNA(null); // Clear previous while extracting
    return await extractVoiceDNA(posts);
  }, [extractVoiceDNA]);

  const refresh = useCallback(() => {
    const stored = loadFromSessionStorage();
    if (stored) {
      setVoiceDNA(stored);
    }
  }, [loadFromSessionStorage]);

  const reset = useCallback(() => {
    setVoiceDNA(null);
    resetWorker();
    sessionStorage.removeItem('voiceDNA');
  }, [resetWorker]);

  // Initialize from sessionStorage on mount
  useEffect(() => {
    const stored = loadFromSessionStorage();
    if (stored && !voiceDNA) {
      setVoiceDNA(stored);
    }
  }, [loadFromSessionStorage, voiceDNA]);

  return {
    voiceDNA,
    loading,
    error,
    progress,
    stage,
    stageMessage,
    extractVoiceDNA: extractVoiceDNAWrapper,
    refresh,
    reset,
    cancel,
    setVoiceDNA,
    setLoading: () => {}, // No-op, managed by worker
    setError: () => {},   // No-op, managed by worker
  };
}