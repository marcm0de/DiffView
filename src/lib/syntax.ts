// Lightweight syntax highlighting for code diffs
// Detects language from content heuristics and applies token-based coloring

export type Language = 'javascript' | 'python' | 'json' | 'html' | 'css' | 'sql' | 'shell' | 'plain';

export interface SyntaxToken {
  text: string;
  type: 'keyword' | 'string' | 'number' | 'comment' | 'operator' | 'function' | 'type' | 'plain';
}

const JS_KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
  'switch', 'case', 'break', 'continue', 'new', 'delete', 'typeof', 'instanceof',
  'import', 'export', 'from', 'default', 'class', 'extends', 'super', 'this',
  'try', 'catch', 'finally', 'throw', 'async', 'await', 'yield', 'of', 'in',
  'true', 'false', 'null', 'undefined', 'void', 'interface', 'type', 'enum',
  'implements', 'abstract', 'private', 'protected', 'public', 'static', 'readonly',
]);

const PYTHON_KEYWORDS = new Set([
  'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'return', 'import', 'from',
  'as', 'with', 'try', 'except', 'finally', 'raise', 'pass', 'break', 'continue',
  'and', 'or', 'not', 'in', 'is', 'lambda', 'yield', 'async', 'await', 'True',
  'False', 'None', 'self', 'print', 'global', 'nonlocal', 'del', 'assert',
]);

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'UPDATE', 'DELETE', 'CREATE', 'DROP',
  'ALTER', 'TABLE', 'INDEX', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON',
  'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL', 'AS', 'ORDER',
  'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL', 'DISTINCT', 'SET',
  'VALUES', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CASCADE', 'COUNT', 'SUM',
  'AVG', 'MAX', 'MIN', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
]);

export function detectLanguage(text: string): Language {
  const lines = text.split('\n').slice(0, 30);
  const sample = lines.join('\n');

  // JSON
  const trimmed = sample.trim();
  if ((trimmed.startsWith('{') && trimmed.includes('"')) || (trimmed.startsWith('[') && trimmed.includes('{'))) {
    try { JSON.parse(text); return 'json'; } catch { /* continue */ }
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json';
  }

  // HTML
  if (/<\/?[a-z][\s\S]*>/i.test(sample) && (sample.includes('</') || sample.includes('/>'))) return 'html';

  // CSS
  if (/[.#@][a-z][\w-]*\s*\{/i.test(sample) && sample.includes('{') && sample.includes('}')) return 'css';

  // SQL
  const sqlScore = lines.filter(l => /^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i.test(l)).length;
  if (sqlScore >= 1) return 'sql';

  // Shell
  if (lines.some(l => /^(#!\/|export |alias |echo |cd |ls |grep |awk |sed |chmod |curl |wget )/i.test(l))) return 'shell';
  if (lines.some(l => /^\s*\$\s/.test(l))) return 'shell';

  // Python
  const pyScore = lines.filter(l => /^\s*(def |class |import |from |if |elif |print\(|#)/.test(l)).length;
  if (pyScore >= 2) return 'python';

  // JavaScript/TypeScript
  const jsScore = lines.filter(l =>
    /^\s*(const |let |var |function |import |export |class |interface |type |=>|\/\/)/.test(l)
  ).length;
  if (jsScore >= 2) return 'javascript';

  return 'plain';
}

export function tokenize(line: string, language: Language): SyntaxToken[] {
  if (language === 'plain') return [{ text: line, type: 'plain' }];

  const tokens: SyntaxToken[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    let matched = false;

    // Comments
    if (language === 'javascript' || language === 'css' || language === 'json') {
      if (remaining.startsWith('//')) {
        tokens.push({ text: remaining, type: 'comment' });
        return tokens;
      }
      if (remaining.startsWith('/*')) {
        const end = remaining.indexOf('*/');
        if (end >= 0) {
          tokens.push({ text: remaining.slice(0, end + 2), type: 'comment' });
          remaining = remaining.slice(end + 2);
          matched = true;
        } else {
          tokens.push({ text: remaining, type: 'comment' });
          return tokens;
        }
      }
    }
    if ((language === 'python' || language === 'shell') && remaining.match(/^#/)) {
      tokens.push({ text: remaining, type: 'comment' });
      return tokens;
    }
    if (language === 'sql' && remaining.startsWith('--')) {
      tokens.push({ text: remaining, type: 'comment' });
      return tokens;
    }
    if (language === 'html' && remaining.startsWith('<!--')) {
      const end = remaining.indexOf('-->');
      if (end >= 0) {
        tokens.push({ text: remaining.slice(0, end + 3), type: 'comment' });
        remaining = remaining.slice(end + 3);
        matched = true;
      } else {
        tokens.push({ text: remaining, type: 'comment' });
        return tokens;
      }
    }

    if (matched) continue;

    // Strings
    const strMatch = remaining.match(/^(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/);
    if (strMatch) {
      tokens.push({ text: strMatch[0], type: 'string' });
      remaining = remaining.slice(strMatch[0].length);
      continue;
    }

    // Numbers
    const numMatch = remaining.match(/^-?\b\d+\.?\d*(?:[eE][+-]?\d+)?\b/);
    if (numMatch && (tokens.length === 0 || /[\s,\(:=\[{+\-*/]$/.test(tokens[tokens.length - 1].text))) {
      tokens.push({ text: numMatch[0], type: 'number' });
      remaining = remaining.slice(numMatch[0].length);
      continue;
    }

    // HTML tags
    if (language === 'html') {
      const tagMatch = remaining.match(/^<\/?[a-zA-Z][\w.-]*(?:\s[^>]*)?\/?>/);
      if (tagMatch) {
        tokens.push({ text: tagMatch[0], type: 'keyword' });
        remaining = remaining.slice(tagMatch[0].length);
        continue;
      }
    }

    // Keywords and identifiers
    const wordMatch = remaining.match(/^[a-zA-Z_$][\w$]*/);
    if (wordMatch) {
      const word = wordMatch[0];
      let type: SyntaxToken['type'] = 'plain';

      if (language === 'javascript' && JS_KEYWORDS.has(word)) {
        type = 'keyword';
      } else if (language === 'python' && PYTHON_KEYWORDS.has(word)) {
        type = 'keyword';
      } else if (language === 'sql' && SQL_KEYWORDS.has(word.toUpperCase())) {
        type = 'keyword';
      } else if (language === 'css' && /^(px|em|rem|vh|vw|%|auto|inherit|none|block|flex|grid|relative|absolute|fixed)$/.test(word)) {
        type = 'keyword';
      }

      // Function calls
      if (type === 'plain' && remaining.slice(word.length).match(/^\s*\(/)) {
        type = 'function';
      }

      // Type-like words (PascalCase)
      if (type === 'plain' && /^[A-Z][a-zA-Z]/.test(word)) {
        type = 'type';
      }

      tokens.push({ text: word, type });
      remaining = remaining.slice(word.length);
      continue;
    }

    // Operators
    const opMatch = remaining.match(/^(===|!==|==|!=|<=|>=|=>|&&|\|\||[+\-*/%=<>!&|^~?:])/);
    if (opMatch) {
      tokens.push({ text: opMatch[0], type: 'operator' });
      remaining = remaining.slice(opMatch[0].length);
      continue;
    }

    // Anything else: single character
    tokens.push({ text: remaining[0], type: 'plain' });
    remaining = remaining.slice(1);
  }

  return tokens;
}

export const TOKEN_COLORS = {
  dark: {
    keyword: 'text-purple-400',
    string: 'text-green-400',
    number: 'text-amber-400',
    comment: 'text-zinc-500 italic',
    operator: 'text-cyan-300',
    function: 'text-blue-400',
    type: 'text-teal-400',
    plain: '',
  },
  light: {
    keyword: 'text-purple-600',
    string: 'text-green-700',
    number: 'text-amber-700',
    comment: 'text-zinc-400 italic',
    operator: 'text-cyan-700',
    function: 'text-blue-600',
    type: 'text-teal-600',
    plain: '',
  },
} as const;
