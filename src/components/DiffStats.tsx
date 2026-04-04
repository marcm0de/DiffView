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

  const total = stats.added + stats.removed + stats.changed + stats.unchanged;
  const addedPct = total > 0 ? (stats.added / total) * 100 : 0;
  const removedPct = total > 0 ? (stats.removed / total) * 100 : 0;
  const changedPct = total > 0 ? (stats.changed / total) * 100 : 0;
  const unchangedPct = total > 0 ? (stats.unchanged / total) * 100 : 0;

  return (
    <div
      className={`px-5 py-2.5 text-xs font-mono border-b ${
        theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
      }`}
    >
      {/* Visual bar */}
      <div className="flex h-2 rounded-full overflow-hidden mb-2.5 gap-px">
        {stats.added > 0 && <div className="bg-green-500 rounded-sm" style={{ width: `${addedPct}%` }} />}
        {stats.removed > 0 && <div className="bg-red-500 rounded-sm" style={{ width: `${removedPct}%` }} />}
        {stats.changed > 0 && <div className="bg-yellow-500 rounded-sm" style={{ width: `${changedPct}%` }} />}
        {stats.unchanged > 0 && <div className={`rounded-sm ${theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-300'}`} style={{ width: `${unchangedPct}%` }} />}
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" />
          <span className="text-green-500 font-medium">+{stats.added}</span> added
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" />
          <span className="text-red-500 font-medium">−{stats.removed}</span> removed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500 inline-block" />
          <span className="text-yellow-500 font-medium">~{stats.changed}</span> changed
        </span>
        <span className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}>
          {stats.unchanged} unchanged
        </span>
        <span className={`border-l pl-4 ${theme === 'dark' ? 'border-zinc-700' : 'border-zinc-300'}`}>
          <span className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}>
            {charStats.origChars.toLocaleString()} → {charStats.modChars.toLocaleString()} chars
          </span>
          <span className={`ml-1 font-medium ${charStats.diff > 0 ? 'text-green-500' : charStats.diff < 0 ? 'text-red-500' : ''}`}>
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
    </div>
  );
}
