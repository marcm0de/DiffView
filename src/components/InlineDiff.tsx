'use client';

import { useDiffStore } from '@/store/diff-store';
import { computeInlineDiff, DiffLine } from '@/lib/diff-utils';
import { useMemo } from 'react';

export default function InlineDiff() {
  const { original, modified, theme } = useDiffStore();
  const lines = useMemo(() => computeInlineDiff(original, modified), [original, modified]);

  const hasContent = original.length > 0 || modified.length > 0;
  if (!hasContent) return null;

  const lineNumStyle = (type: DiffLine['type']) => {
    const base = 'select-none text-right pr-3 pl-2 w-12 shrink-0 border-r text-xs leading-6';
    if (type === 'added') {
      return `${base} ${theme === 'dark' ? 'bg-green-950/50 border-green-900/40 text-green-700' : 'bg-green-100/80 border-green-200 text-green-600'}`;
    }
    if (type === 'removed') {
      return `${base} ${theme === 'dark' ? 'bg-red-950/50 border-red-900/40 text-red-700' : 'bg-red-100/80 border-red-200 text-red-600'}`;
    }
    return `${base} ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-600' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`;
  };

  const lineContentStyle = (type: DiffLine['type']) => {
    const base = 'px-3 flex-1 min-w-0 whitespace-pre font-mono text-sm leading-6 overflow-x-auto';
    if (type === 'added') {
      return `${base} ${theme === 'dark' ? 'bg-green-950/20 text-green-200' : 'bg-green-50 text-green-900'}`;
    }
    if (type === 'removed') {
      return `${base} ${theme === 'dark' ? 'bg-red-950/20 text-red-200' : 'bg-red-50 text-red-900'}`;
    }
    return `${base} ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-800'}`;
  };

  const prefixChar = (type: DiffLine['type']) => {
    if (type === 'added') return '+';
    if (type === 'removed') return '−';
    return ' ';
  };

  const prefixStyle = (type: DiffLine['type']) => {
    const base = 'w-5 shrink-0 text-center select-none text-xs leading-6 font-bold';
    if (type === 'added') return `${base} ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`;
    if (type === 'removed') return `${base} ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`;
    return `${base} text-transparent`;
  };

  return (
    <div className="flex-1 overflow-auto">
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <div className={lineNumStyle(line.type)}>
            {line.lineNumber ?? ''}
          </div>
          <div className={prefixStyle(line.type)}>{prefixChar(line.type)}</div>
          <div className={lineContentStyle(line.type)}>
            {line.content || '\u00A0'}
          </div>
        </div>
      ))}
    </div>
  );
}
