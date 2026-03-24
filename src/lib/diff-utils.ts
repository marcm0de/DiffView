import * as Diff from 'diff';

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'empty';
  content: string;
  lineNumber: number | null;
  words?: DiffWord[];
}

export interface DiffWord {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

export interface DiffPair {
  left: DiffLine;
  right: DiffLine;
}

export interface DiffStats {
  added: number;
  removed: number;
  changed: number;
  unchanged: number;
}

export function computeLineDiff(original: string, modified: string): DiffPair[] {
  const changes = Diff.diffLines(original, modified);
  const pairs: DiffPair[] = [];
  
  let leftLineNum = 1;
  let rightLineNum = 1;
  
  let i = 0;
  while (i < changes.length) {
    const change = changes[i];
    
    if (!change.added && !change.removed) {
      // Unchanged lines
      const lines = splitLines(change.value);
      for (const line of lines) {
        pairs.push({
          left: { type: 'unchanged', content: line, lineNumber: leftLineNum++ },
          right: { type: 'unchanged', content: line, lineNumber: rightLineNum++ },
        });
      }
      i++;
    } else if (change.removed && i + 1 < changes.length && changes[i + 1].added) {
      // Changed lines (removed followed by added)
      const removedLines = splitLines(change.value);
      const addedLines = splitLines(changes[i + 1].value);
      const maxLen = Math.max(removedLines.length, addedLines.length);
      
      for (let j = 0; j < maxLen; j++) {
        const leftLine = j < removedLines.length ? removedLines[j] : '';
        const rightLine = j < addedLines.length ? addedLines[j] : '';
        
        const words = j < removedLines.length && j < addedLines.length
          ? computeWordDiff(leftLine, rightLine)
          : undefined;
        
        pairs.push({
          left: j < removedLines.length
            ? { type: 'removed', content: leftLine, lineNumber: leftLineNum++, words: words?.left }
            : { type: 'empty', content: '', lineNumber: null },
          right: j < addedLines.length
            ? { type: 'added', content: rightLine, lineNumber: rightLineNum++, words: words?.right }
            : { type: 'empty', content: '', lineNumber: null },
        });
      }
      i += 2;
    } else if (change.removed) {
      const lines = splitLines(change.value);
      for (const line of lines) {
        pairs.push({
          left: { type: 'removed', content: line, lineNumber: leftLineNum++ },
          right: { type: 'empty', content: '', lineNumber: null },
        });
      }
      i++;
    } else if (change.added) {
      const lines = splitLines(change.value);
      for (const line of lines) {
        pairs.push({
          left: { type: 'empty', content: '', lineNumber: null },
          right: { type: 'added', content: line, lineNumber: rightLineNum++ },
        });
      }
      i++;
    } else {
      i++;
    }
  }
  
  return pairs;
}

export function computeInlineDiff(original: string, modified: string): DiffLine[] {
  const changes = Diff.diffLines(original, modified);
  const lines: DiffLine[] = [];
  let lineNum = 1;
  
  for (const change of changes) {
    const splitLns = splitLines(change.value);
    for (const line of splitLns) {
      if (change.added) {
        lines.push({ type: 'added', content: line, lineNumber: lineNum++ });
      } else if (change.removed) {
        lines.push({ type: 'removed', content: line, lineNumber: lineNum++ });
      } else {
        lines.push({ type: 'unchanged', content: line, lineNumber: lineNum++ });
      }
    }
  }
  
  return lines;
}

function computeWordDiff(left: string, right: string): { left: DiffWord[]; right: DiffWord[] } {
  const wordChanges = Diff.diffWords(left, right);
  const leftWords: DiffWord[] = [];
  const rightWords: DiffWord[] = [];
  
  for (const change of wordChanges) {
    if (change.added) {
      rightWords.push({ type: 'added', value: change.value });
    } else if (change.removed) {
      leftWords.push({ type: 'removed', value: change.value });
    } else {
      leftWords.push({ type: 'unchanged', value: change.value });
      rightWords.push({ type: 'unchanged', value: change.value });
    }
  }
  
  return { left: leftWords, right: rightWords };
}

function splitLines(text: string): string[] {
  if (!text) return [];
  // Remove trailing newline to avoid empty last line
  const trimmed = text.endsWith('\n') ? text.slice(0, -1) : text;
  if (trimmed === '') return [];
  return trimmed.split('\n');
}

export function computeStats(original: string, modified: string): DiffStats {
  const changes = Diff.diffLines(original, modified);
  let added = 0;
  let removed = 0;
  let unchanged = 0;
  
  for (const change of changes) {
    const count = splitLines(change.value).length;
    if (change.added) {
      added += count;
    } else if (change.removed) {
      removed += count;
    } else {
      unchanged += count;
    }
  }
  
  const changed = Math.min(added, removed);
  
  return {
    added: added - changed,
    removed: removed - changed,
    changed,
    unchanged,
  };
}

export function createUnifiedPatch(original: string, modified: string, filename = 'file'): string {
  return Diff.createPatch(filename, original, modified, 'original', 'modified');
}

export function encodeShareUrl(original: string, modified: string): string {
  const data = JSON.stringify({ o: original, m: modified });
  if (typeof window !== 'undefined') {
    const encoded = btoa(unescape(encodeURIComponent(data)));
    return `${window.location.origin}${window.location.pathname}?d=${encoded}`;
  }
  return '';
}

export function decodeShareUrl(encoded: string): { original: string; modified: string } | null {
  try {
    const decoded = decodeURIComponent(escape(atob(encoded)));
    const data = JSON.parse(decoded);
    return { original: data.o || '', modified: data.m || '' };
  } catch {
    return null;
  }
}
