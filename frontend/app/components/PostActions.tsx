"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePost } from "@/lib/api";

type Props = {
  postId: number;
};

export default function PostActions({ postId }: Props) {
  const router = useRouter();
  const isLoggedIn =
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false;

  async function handleDelete() {
    if (!confirm("この投稿を削除しますか？")) return;
    const token = localStorage.getItem("token") ?? "";
    await deletePost(postId, token);
    router.push("/");
    router.refresh();
  }

  if (!isLoggedIn) return null;

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/posts/${postId}/edit`}
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
      >
        編集
      </Link>
      <button
        onClick={handleDelete}
        className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        削除
      </button>
    </div>
  );
}
