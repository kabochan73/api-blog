"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPost, getTags, updatePost, type Tag } from "@/lib/api";

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    Promise.all([getPost(Number(id), token), getTags()]).then(([post, allTags]) => {
      setTitle(post.title);
      setBody(post.body);
      setStatus(post.status);
      setSelectedTagIds(post.tags.map((t) => t.id));
      setTags(allTags);
    });
  }, [id, router]);

  function toggleTag(tagId: number) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token") ?? "";

    try {
      await updatePost(Number(id), { title, body, status, tag_ids: selectedTagIds }, token);
      router.push(`/posts/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <button onClick={() => router.back()} className="text-sm text-zinc-500 hover:text-zinc-900">
            ← 戻る
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-zinc-900">投稿を編集</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700">タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">本文</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={12}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-zinc-700">タグ</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`rounded-full px-3 py-1 text-xs transition-colors ${
                      selectedTagIds.includes(tag.id)
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700">公開設定</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className="mt-1 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            >
              <option value="draft">下書き</option>
              <option value="published">公開</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {loading ? "更新中..." : "更新する"}
          </button>
        </form>
      </main>
    </div>
  );
}
