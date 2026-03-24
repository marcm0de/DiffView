'use client';

import { useDiffStore } from '@/store/diff-store';
import { computeLineDiff, DiffLine, DiffWord } from '@/lib/diff-utils';
import { useMemo } from 'react';

function renderWords(words: DiffWord[] | undefined, content: string, type: DiffLine['type'], theme: string) {
  if (!words || words.length === 0) {
    return <span>{content || '\u00A0'}</span>;
  }

  return (
    <>
      {words.map((word, i) => {
        if (word.type === 'unchanged') {
          return <span key={i}>{word.value}</span>;
        }
        const highlight =
          type === 'removed'
            ? theme === 'dark'
              ? 'bg-red-800/60 rounded-sm'
              : 'bg-red-300/60 rounded-sm'
            : theme === 'dark'
              ? 'bg-green-800/60 rounded-sm'
              : 'bg-green-300/60 rounded-sm';
        return (
          <span key={i} className={highlight}>
            {word.value}
          </span>
        );
      })}
    </>
  );
}

export default function SideBySideDiff() {
  const { original, modified, theme } = useDiffStore();
  const pairs = useMemo(() => computeLineDiff(original, modified), [original, modified]);

  const hasContent = original.length > 0 || modified.length > 0;
  if (!hasContent) return null;

  const lineNumStyle = (type: DiffLine['type']) => {
    const base = 'select-none text-right pr-3 pl-2 w-12 shrink-0 border-r text-xs leading-6';
    if (type === 'empty') {
      return `${base} ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-700' : 'bg-zinc-100 border-zinc-200 text-zinc-300'}`;
    }
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
    if (type === 'empty') {
      return `${base} ${theme === 'dark' ? 'bg-zinc-900/30' : 'bg-zinc-50'}`;
    }
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
    <div className="flex flex-1 overflow-auto">
      {/* Left side */}
      <div className={`flex-1 border-r ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'}`}>
        {pairs.map((pair, i) => (
          <div key={i} className="flex">
            <div className={lineNumStyle(pair.left.type)}>
              {pair.left.lineNumber ?? ''}
            </div>
            <div className={prefixStyle(pair.left.type)}>{prefixChar(pair.left.type)}</div>
            <div className={lineContentStyle(pair.left.type)}>
              {renderWords(pair.left.words, pair.left.content, pair.left.type, theme)}
            </div>
          </div>
        ))}
      </div>

      {/* Right side */}
      <div className="flex-1">
        {pairs.map((pair, i) => (
          <div key={i} className="flex">
            <div className={lineNumStyle(pair.right.type)}>
              {pair.right.lineNumber ?? ''}
            </div>
            <div className={prefixStyle(pair.right.type)}>{prefixChar(pair.right.type)}</div>
            <div className={lineContentStyle(pair.right.type)}>
              {renderWords(pair.right.words, pair.right.content, pair.right.type, theme)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
