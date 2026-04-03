'use client';

import { useDiffStore } from '@/store/diff-store';
import { computeStats } from '@/lib/diff-utils';
import { useMemo } from 'react';

export default function DiffStats() {
  const { original, modified, theme } = useDiffStore();

  const stats = useMemo(() => computeStats(original, modified), [original, modified]);
  const hasContent = original.length > 0 || modified.length > 0;

  const charStats = useMemo(() => {
    const origChars = original.length;
    const modChars = modified.length;
    const diff = modChars - origChars;
    const origWords = original.trim() ? original.trim().split(/\s+/).length : 0;
    const modWords = modified.trim() ? modified.trim().split(/\s+/).length : 0;
    const origLines = original ? original.split('\n').length : 0;
    const modLines = modified ? modified.split('\n').length : 0;
    return { origChars, modChars, diff, origWords, modWords, origLines, modLines };
  }, [original, modified]);

  if (!hasContent) return null;

  return (
    <div
      className={`flex items-center gap-4 px-5 py-2 text-xs font-mono border-b flex-wrap ${
        theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
      }`}
    >
      <span className="text-green-500">+{stats.added} added</span>
      <span className="text-red-500">−{stats.removed} removed</span>
      <span className="text-yellow-500">~{stats.changed} changed</span>
      <span className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}>
        {stats.unchanged} unchanged
      </span>
      <span className={`border-l pl-4 ${theme === 'dark' ? 'border-zinc-700' : 'border-zinc-300'}`}>
        <span className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}>
          {charStats.origChars.toLocaleString()} → {charStats.modChars.toLocaleString()} chars
        </span>
        <span className={`ml-1 ${charStats.diff > 0 ? 'text-green-500' : charStats.diff < 0 ? 'text-red-500' : ''}`}>
          ({charStats.diff > 0 ? '+' : ''}{charStats.diff.toLocaleString()})
        </span>
      </span>
      <span className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}>
        {charStats.origWords} → {charStats.modWords} words
      </span>
      <span className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}>
        {charStats.origLines} → {charStats.modLines} lines
      </span>
    </div>
  );
}
