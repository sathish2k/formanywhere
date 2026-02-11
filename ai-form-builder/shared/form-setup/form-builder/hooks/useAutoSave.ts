/**
 * Auto-Save Hook
 * Automatically saves form builder state at intervals
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SaveStatus } from '../components/SaveStatusIndicator';

interface UseAutoSaveOptions {
  data: any;
  onSave: (data: any) => Promise<void>;
  interval?: number; // milliseconds
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  status: SaveStatus;
  lastSaved: Date | null;
  error: string | null;
  saveNow: () => Promise<void>;
}

export function useAutoSave({
  data,
  onSave,
  interval = 30000, // 30 seconds
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dataRef = useRef(data);
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isSavingRef = useRef(false);

  // Update data ref when data changes
  useEffect(() => {
    dataRef.current = data;
    // Mark as having unsaved changes
    if (lastSaved && status === 'saved') {
      setStatus('idle');
    }
  }, [data, lastSaved, status]);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (isSavingRef.current) return;

    try {
      isSavingRef.current = true;
      setStatus('saving');
      setError(null);

      await onSave(dataRef.current);

      setStatus('saved');
      setLastSaved(new Date());
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to save');
      console.error('Save failed:', err);
    } finally {
      isSavingRef.current = false;
    }
  }, [onSave, setStatus, setError, setLastSaved]);

  // Auto-save effect
  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      if (status !== 'saved' && !isSavingRef.current) {
        saveNow();
      }
    }, interval);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [enabled, interval, status, saveNow]);

  return {
    status,
    lastSaved,
    error,
    saveNow,
  };
}
