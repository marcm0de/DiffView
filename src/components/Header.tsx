'use client';

import { useDiffStore } from '@/store/diff-store';
import {
  ArrowLeftRight,
  Columns2,
  AlignLeft,
  Sun,
  Moon,
  Trash2,
  Share2,
  Copy,
  FileUp,
} from 'lucide-react';
import { encodeShareUrl, createUnifiedPatch } from '@/lib/diff-utils';
import { useRef } from 'react';

export default function Header() {
  const {
    original,
    modified,
    viewMode,
    theme,
    setOriginal,
    setModified,
    setViewMode,
    toggleTheme,
    swapSides,
    clear,
  } = useDiffStore();

  const leftFileRef = useRef<HTMLInputElement>(null);
  const rightFileRef = useRef<HTMLInputElement>(null);

  const handleShare = () => {
    const url = encodeShareUrl(original, modified);
    if (url) {
      navigator.clipboard.writeText(url);
      alert('Share URL copied to clipboard!');
    }
  };

  const handleCopyPatch = () => {
    const patch = createUnifiedPatch(original, modified);
    navigator.clipboard.writeText(patch);
    alert('Unified diff copied to clipboard!');
  };

  const handleFileUpload = (side: 'left' | 'right') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (side === 'left') setOriginal(text);
      else setModified(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const btnBase =
    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer';
  const btnStyle =
    theme === 'dark'
      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
      : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800';
  const activeBtnStyle =
    theme === 'dark'
      ? 'bg-blue-600 hover:bg-blue-500 text-white'
      : 'bg-blue-500 hover:bg-blue-400 text-white';

  return (
    <header
      className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b ${
        theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <h1
          className={`text-lg font-bold tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          }`}
        >
          <span className="text-blue-500">Diff</span>View
        </h1>

        <div className="flex items-center gap-1 ml-3">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`${btnBase} ${viewMode === 'side-by-side' ? activeBtnStyle : btnStyle}`}
          >
            <Columns2 size={15} />
            Side by Side
          </button>
          <button
            onClick={() => setViewMode('inline')}
            className={`${btnBase} ${viewMode === 'inline' ? activeBtnStyle : btnStyle}`}
          >
            <AlignLeft size={15} />
            Inline
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <button onClick={swapSides} className={`${btnBase} ${btnStyle}`} title="Swap sides">
          <ArrowLeftRight size={15} />
          Swap
        </button>

        <button
          onClick={() => leftFileRef.current?.click()}
          className={`${btnBase} ${btnStyle}`}
          title="Upload original file"
        >
          <FileUp size={15} />
          Original
        </button>
        <input
          ref={leftFileRef}
          type="file"
          className="hidden"
          accept=".txt,.md,.js,.ts,.jsx,.tsx,.py,.json,.html,.css,.xml,.yml,.yaml,.sh,.go,.rs,.java,.c,.cpp,.h,.rb,.php,.sql,.csv"
          onChange={handleFileUpload('left')}
        />

        <button
          onClick={() => rightFileRef.current?.click()}
          className={`${btnBase} ${btnStyle}`}
          title="Upload modified file"
        >
          <FileUp size={15} />
          Modified
        </button>
        <input
          ref={rightFileRef}
          type="file"
          className="hidden"
          accept=".txt,.md,.js,.ts,.jsx,.tsx,.py,.json,.html,.css,.xml,.yml,.yaml,.sh,.go,.rs,.java,.c,.cpp,.h,.rb,.php,.sql,.csv"
          onChange={handleFileUpload('right')}
        />

        <button onClick={handleCopyPatch} className={`${btnBase} ${btnStyle}`} title="Copy unified diff">
          <Copy size={15} />
          Patch
        </button>

        <button onClick={handleShare} className={`${btnBase} ${btnStyle}`} title="Share via URL">
          <Share2 size={15} />
          Share
        </button>

        <button onClick={clear} className={`${btnBase} ${btnStyle}`} title="Clear all">
          <Trash2 size={15} />
          Clear
        </button>

        <button onClick={toggleTheme} className={`${btnBase} ${btnStyle}`} title="Toggle theme">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}
