// Paste File Hook - Handle Ctrl+V file pasting
// Version: 1.0.0
// Last Updated: 2026-08-29

import { useState, useCallback } from 'react';

export function usePasteFile() {
  const [isPasting, setIsPasting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaste = useCallback(async (event: ClipboardEvent): Promise<File | null> => {
    event.preventDefault();

    try {
      setIsPasting(true);
      setError(null);

      const items = event.clipboardData?.items;
      if (!items) return null;

      const fileItem = Array.from(items).find(item => item.type.startsWith('text/csv') || item.type.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'));
      
      if (!fileItem) {
        setError('No CSV or Excel file found in clipboard');
        return null;
      }

      const file = fileItem.getAsFile();
      if (!file) {
        setError('Failed to get file from clipboard');
        return null;
      }

      return file;
    } catch (err) {
      setError('Failed to paste file');
      return null;
    } finally {
      setIsPasting(false);
    }
  }, []);

  return {
    isPasting,
    error,
    handlePaste
  };
}
