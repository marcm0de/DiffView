'use client';

import { useDiffStore } from '@/store/diff-store';
import { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';

interface TextInputProps {
  side: 'left' | 'right';
}

export default function TextInput({ side }: TextInputProps) {
  const { original, modified, setOriginal, setModified, theme } = useDiffStore();
  const value = side === 'left' ? original : modified;
  const setter = side === 'left' ? setOriginal : setModified;
  const label = side === 'left' ? 'Original' : 'Modified';
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setter(ev.target?.result as string);
        setFileName(file.name);
      };
      reader.readAsText(file);
    },
    [setter]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const charCount = value.length;
  const lineCount = value ? value.split('\n').length : 0;

  return (
    <div className="flex flex-col flex-1 min-w-0 relative">
      <div
        className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border-b flex items-center justify-between ${
          theme === 'dark'
            ? 'bg-zinc-800/50 text-zinc-400 border-zinc-800'
            : 'bg-zinc-100 text-zinc-500 border-zinc-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <span>{label}</span>
          {fileName && (
            <span className={`flex items-center gap-1 text-[10px] font-normal px-1.5 py-0.5 rounded ${
              theme === 'dark' ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-200 text-zinc-600'
            }`}>
              <File className="w-2.5 h-2.5" />
              {fileName}
              <button onClick={() => { setFileName(null); setter(''); }} className="hover:text-red-400">
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-normal ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>
            {charCount.toLocaleString()} chars · {lineCount} lines
          </span>
          <label className={`cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-normal transition-colors ${
            theme === 'dark' ? 'hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300' : 'hover:bg-zinc-200 text-zinc-400 hover:text-zinc-600'
          }`}>
            <Upload className="w-3 h-3" />
            Browse
            <input type="file" className="hidden" accept=".txt,.js,.ts,.tsx,.jsx,.json,.md,.css,.html,.xml,.yml,.yaml,.py,.rb,.go,.rs,.java,.c,.cpp,.h,.hpp,.cs,.php,.sh,.sql,.csv" onChange={handleFileInput} />
          </label>
        </div>
      </div>

      <div
        className="flex-1 relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <textarea
          value={value}
          onChange={(e) => { setter(e.target.value); setFileName(null); }}
          placeholder={`Paste ${label.toLowerCase()} text here or drag & drop a file...`}
          spellCheck={false}
          className={`w-full h-full p-3 font-mono text-sm resize-none outline-none min-h-[200px] ${
            theme === 'dark'
              ? 'bg-zinc-950 text-zinc-100 placeholder-zinc-600'
              : 'bg-white text-zinc-900 placeholder-zinc-400'
          }`}
        />

        {/* Drag overlay */}
        {isDragging && (
          <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg backdrop-blur-sm transition-all ${
            theme === 'dark'
              ? 'bg-blue-500/10 border-blue-500/50'
              : 'bg-blue-50 border-blue-400'
          }`}>
            <Upload className={`w-10 h-10 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
              Drop file here
            </span>
            <span className={`text-xs ${theme === 'dark' ? 'text-blue-400/60' : 'text-blue-500/60'}`}>
              Text files only
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
