'use client';

import { useDiffStore } from '@/store/diff-store';
import { computeStats } from '@/lib/diff-utils';
import { useMemo } from 'react';

export default function DiffStats() {
  const { original, modified, theme } = useDiffStore();

  const stats = useMemo(() => computeStats(original, modified), [original, modified]);
  const hasContent = original.length > 0 || modified.length > 0;

  if (!hasContent) return null;

  return (
    <div
      className={`flex items-center gap-4 px-5 py-2 text-xs font-mono border-b ${
        theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
      }`}
    >
      <span className="text-green-500">+{stats.added} added</span>
      <span className="text-red-500">−{stats.removed} removed</span>
      <span className="text-yellow-500">~{stats.changed} changed</span>
      <span className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}>
        {stats.unchanged} unchanged
      </span>
    </div>
  );
}
