"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getTags, createTag, deleteTag, type Tag } from "@/lib/api";

export default function TagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#6b7280");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    getTags().then(setTags).catch(() => {});
  }, [router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const token = localStorage.getItem("token") ?? "";
    try {
      const tag = await createTag(newTagName, newTagColor, token);
      setTags((prev) => [...prev, tag]);
      setNewTagName("");
      setNewTagColor("#6b7280");
    } catch (err) {
      setError(err instanceof Error ? err.message : "作成に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("このタグを削除しますか？")) return;
    const token = localStorage.getItem("token") ?? "";
    try {
      await deleteTag(id, token);
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("削除に失敗しました");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
            ← 一覧に戻る
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-zinc-900">タグ管理</h1>

        <form onSubmit={handleCreate} className="mt-6 flex gap-2">
          <input
            type="color"
            value={newTagColor}
            onChange={(e) => setNewTagColor(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded-md border border-zinc-300 p-0.5"
          />
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="タグ名を入力"
            required
            maxLength={20}
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {loading ? "追加中..." : "追加"}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <ul className="mt-8 space-y-2">
          {tags.length === 0 ? (
            <p className="text-sm text-zinc-500">タグがありません</p>
          ) : (
            tags.map((tag) => (
              <li
                key={tag.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block h-4 w-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-sm font-medium text-zinc-900">{tag.name}</span>
                  <span className="text-xs text-zinc-400">{tag.slug}</span>
                </div>
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  削除
                </button>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}
