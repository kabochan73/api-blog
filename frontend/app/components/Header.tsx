"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const isMounted = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const base = pathname === "/drafts" ? "/drafts" : "/";
    const timer = setTimeout(() => {
      const q = search.trim();
      router.push(q ? `${base}?search=${encodeURIComponent(q)}` : base);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    setIsLoggedIn(false);
    router.push("/");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    const base = pathname === "/drafts" ? "/drafts" : "/";
    router.push(q ? `${base}?search=${encodeURIComponent(q)}` : base);
  }

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-6">
        <Link href="/" className="text-2xl font-bold text-zinc-900 shrink-0">
          Blog
        </Link>

        <form onSubmit={handleSearch} className="flex flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="記事を検索..."
            className="w-full rounded-l-md border border-zinc-300 px-3 py-1.5 text-sm outline-none focus:border-zinc-500"
          />
          <button
            type="submit"
            className="rounded-r-md border border-l-0 border-zinc-300 bg-zinc-100 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-200"
          >
            検索
          </button>
        </form>

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
