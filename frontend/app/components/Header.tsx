"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    setIsLoggedIn(false);
    router.push("/");
  }

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6">
        <Link href="/" className="text-2xl font-bold text-zinc-900">
          Blog
        </Link>
        {isLoggedIn && (
          <div className="flex items-center gap-3">
            <Link
              href="/drafts"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              下書き
            </Link>
            <Link
              href="/tags"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
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
