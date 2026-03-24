'use client';

import { useDiffStore } from '@/store/diff-store';
import { useCallback } from 'react';

interface TextInputProps {
  side: 'left' | 'right';
}

export default function TextInput({ side }: TextInputProps) {
  const { original, modified, setOriginal, setModified, theme } = useDiffStore();
  const value = side === 'left' ? original : modified;
  const setter = side === 'left' ? setOriginal : setModified;
  const label = side === 'left' ? 'Original' : 'Modified';

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setter(ev.target?.result as string);
      };
      reader.readAsText(file);
    },
    [setter]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <div
        className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border-b ${
          theme === 'dark'
            ? 'bg-zinc-800/50 text-zinc-400 border-zinc-800'
            : 'bg-zinc-100 text-zinc-500 border-zinc-200'
        }`}
      >
        {label}
      </div>
      <textarea
        value={value}
        onChange={(e) => setter(e.target.value)}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        placeholder={`Paste ${label.toLowerCase()} text here or drag & drop a file...`}
        spellCheck={false}
        className={`flex-1 p-3 font-mono text-sm resize-none outline-none min-h-[200px] ${
          theme === 'dark'
            ? 'bg-zinc-950 text-zinc-100 placeholder-zinc-600'
            : 'bg-white text-zinc-900 placeholder-zinc-400'
        }`}
      />
    </div>
  );
}
