"use client";

import { useState } from "react";
import MarkdownContent from "./MarkdownContent";

type Props = {
  value: string;
  onChange: (value: string) => void;
  rows?: number; // テキストエリアの行数（デフォルト12）
};

// マークダウンエディタ
// 「編集」タブでテキスト入力、「プレビュー」タブでレンダリング結果を確認できる
export default function MarkdownEditor({ value, onChange, rows = 12 }: Props) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  return (
    <div className="mt-1">
      {/* タブ切り替えボタン */}
      <div className="flex border-b border-zinc-300 mb-0">
        <button
          type="button"
          onClick={() => setTab("edit")}
          className={`px-4 py-1.5 text-sm font-medium border border-b-0 rounded-t-md mr-1 ${
            tab === "edit"
              ? "bg-white border-zinc-300 text-zinc-900"
              : "bg-zinc-100 border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          編集
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`px-4 py-1.5 text-sm font-medium border border-b-0 rounded-t-md ${
            tab === "preview"
              ? "bg-white border-zinc-300 text-zinc-900"
              : "bg-zinc-100 border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          プレビュー
        </button>
      </div>

      {/* 編集タブ：テキストエリア */}
      {tab === "edit" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          rows={rows}
          placeholder="マークダウンで書けます..."
          className="w-full rounded-b-md rounded-tr-md border border-zinc-300 px-3 py-2 text-sm font-mono outline-none focus:border-zinc-500"
        />
      ) : (
        /* プレビュータブ：マークダウンをレンダリング */
        <div className="min-h-50 w-full rounded-b-md rounded-tr-md border border-zinc-300 px-4 py-3 bg-white">
          {value ? (
            <MarkdownContent content={value} />
          ) : (
            <p className="text-sm text-zinc-400">本文を入力するとプレビューが表示されます</p>
          )}
        </div>
      )}
    </div>
  );
}
