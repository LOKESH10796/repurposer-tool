"use client";

import { useEffect, useState, useCallback } from 'react';

export function useKeyboardShortcuts() {
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to generate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        setActiveShortcut('Generate');
        return;
      }

      // Ctrl/Cmd + C to copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        setActiveShortcut('Copy');
        return;
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        setActiveShortcut('Close');
        return;
      }

      // Ctrl/Cmd + S to download
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setActiveShortcut('Download');
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'c' || e.key === 's') {
        setActiveShortcut(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return activeShortcut;
}

export function KeyboardHint() {
  const shortcut = useKeyboardShortcuts();

  const shortcuts = [
    { key: 'Ctrl+Enter', action: 'Generate' },
    { key: 'Ctrl+C', action: 'Copy' },
    { key: 'Ctrl+S', action: 'Download' },
    { key: 'Esc', action: 'Close' },
  ];

  return (
    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
      {shortcuts.map(({ key, action }) => (
        <span
          key={key}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
            shortcut === action ? 'bg-indigo-500/20 text-indigo-300' : ''
          }`}
        >
          <kbd className="font-mono bg-slate-700/50 px-1.5 py-0.5 rounded text-slate-300">
            {key}
          </kbd>
          <span>{action}</span>
        </span>
      ))}
    </div>
  );
}