"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

// サイト共通のヘッダー
// ロゴ・検索バー・ナビゲーションを含む
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();
  const [search, setSearch] = useState("");
  // debounce用のタイマーを保持するref
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 入力から500ms後に検索リダイレクト（debounce処理）
  // ページ遷移によるリダイレクトを防ぐため、useEffectではなくonChangeで管理
  function handleSearch(value: string) {
    setSearch(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const base = pathname === "/drafts" ? "/drafts" : "/";
      const q = value.trim();
      router.push(q ? `${base}?search=${encodeURIComponent(q)}` : base);
    }, 500);
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-6">
        {/* ロゴ */}
        <Link href="/" className="text-2xl font-bold text-zinc-900 shrink-0">
          My Output Blog(最強)
        </Link>

        {/* 検索バー（/ と /drafts ページのみ表示） */}
        <div className="flex flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="記事を検索..."
            className="w-full rounded-md border border-zinc-300 px-3 py-1.5 text-sm outline-none focus:border-zinc-500"
          />
        </div>

        {/* ログイン時のみナビゲーションを表示 */}
        {isLoggedIn && (
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/drafts" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              下書き
            </Link>
            <Link href="/tags" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              タグ管理
            </Link>
            <Link
              href="/posts/new"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              新規投稿
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
