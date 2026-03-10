"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function toId(children: React.ReactNode) {
  return String(children).toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 id={toId(children)} className="text-2xl font-bold text-zinc-900 mt-8 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 id={toId(children)} className="text-xl font-bold text-zinc-900 mt-6 mb-3">{children}</h2>,
        h3: ({ children }) => <h3 id={toId(children)} className="text-lg font-semibold text-zinc-900 mt-5 mb-2">{children}</h3>,
        p: ({ children }) => <p className="text-zinc-700 leading-8 mb-4">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside text-zinc-700 mb-4 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside text-zinc-700 mb-4 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="leading-7">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-zinc-300 pl-4 text-zinc-500 italic mb-4">{children}</blockquote>
        ),
        code: ({ inline, children }: { inline?: boolean; children?: React.ReactNode }) =>
          inline ? (
            <code className="bg-zinc-100 rounded px-1 py-0.5 text-sm font-mono text-zinc-800">{children}</code>
          ) : (
            <code className="block bg-zinc-100 rounded-md p-4 text-sm font-mono text-zinc-800 overflow-x-auto mb-4 whitespace-pre">
              {children}
            </code>
          ),
        pre: ({ children }) => <pre className="mb-4">{children}</pre>,
        a: ({ href, children }) => (
          <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        hr: () => <hr className="border-zinc-200 my-6" />,
        strong: ({ children }) => <strong className="font-semibold text-zinc-900">{children}</strong>,
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-zinc-300 bg-zinc-100 px-4 py-2 text-left font-semibold text-zinc-900">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-zinc-300 px-4 py-2 text-zinc-700">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
