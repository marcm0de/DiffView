'use client';

import { useEffect } from 'react';
import { useDiffStore } from '@/store/diff-store';
import { decodeShareUrl } from '@/lib/diff-utils';
import Header from './Header';
import TextInput from './TextInput';
import DiffStats from './DiffStats';
import SideBySideDiff from './SideBySideDiff';
import InlineDiff from './InlineDiff';

export default function DiffApp() {
  const { original, modified, viewMode, theme, setOriginal, setModified } = useDiffStore();

  // Load shared diff from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('d');
    if (data) {
      const decoded = decodeShareUrl(data);
      if (decoded) {
        setOriginal(decoded.original);
        setModified(decoded.modified);
      }
    }
  }, [setOriginal, setModified]);

  const hasContent = original.length > 0 || modified.length > 0;

  return (
    <div
      className={`flex flex-col h-screen ${
        theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'
      }`}
    >
      <Header />

      {/* Input panels */}
      <div
        className={`flex border-b ${
          theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'
        }`}
        style={{ height: hasContent ? '30vh' : '50vh' }}
      >
        <TextInput side="left" />
        <div
          className={`w-px ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`}
        />
        <TextInput side="right" />
      </div>

      {/* Stats bar */}
      <DiffStats />

      {/* Diff output */}
      {hasContent && (
        <div className="flex-1 overflow-hidden flex flex-col">
          {viewMode === 'side-by-side' ? <SideBySideDiff /> : <InlineDiff />}
        </div>
      )}

      {/* Empty state */}
      {!hasContent && (
        <div className="flex-1 flex items-center justify-center">
          <div className={`text-center ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>
            <p className="text-lg font-medium">Paste text in both panels to see the diff</p>
            <p className="text-sm mt-1">Or drag & drop files onto either panel</p>
          </div>
        </div>
      )}
    </div>
  );
}
