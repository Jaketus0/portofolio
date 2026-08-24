'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
  inline?: boolean;
}

function CodeBlock({ className, children, inline }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const code = String(children ?? '').replace(/\n$/, '');
  const language = className?.replace(/^language-/, '') || 'text';

  if (inline) {
    return (
      <code className="rounded-md border border-black/10 bg-black/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-zinc-900">
        {children}
      </code>
    );
  }

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="group my-3 overflow-hidden rounded-xl border border-black/10 bg-black/[0.05]">
      <div className="flex items-center justify-between border-b border-black/10 px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wide text-zinc-400">
          {language}
        </span>
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-zinc-400 transition-colors hover:bg-black/5 hover:text-zinc-900"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-zinc-900" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[13px] leading-relaxed bg-black/40 text-zinc-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="space-y-2 text-[13.5px] leading-relaxed text-zinc-700 [&_a]:text-zinc-900 [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold [&_p]:my-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-3 [&_blockquote]:text-zinc-500">
      <ReactMarkdown
        components={{
          code: CodeBlock,
          a: ({ ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noreferrer"
              className="break-all text-zinc-900 underline underline-offset-2 hover:text-black"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}