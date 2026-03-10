"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePost } from "@/lib/api";
import { useAuth } from "@/app/hooks/useAuth";

type Props = {
  postId: number;
};

// 投稿の編集・削除ボタン
// ログイン中のみ表示し、未ログインの場合はnullを返す
export default function PostActions({ postId }: Props) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  // 確認ダイアログを表示してから投稿を削除し、ホームへリダイレクト
  async function handleDelete() {
    if (!confirm("この投稿を削除しますか？")) return;
    const token = localStorage.getItem("token") ?? "";
    await deletePost(postId, token);
    router.push("/");
    router.refresh();
  }

  // 未ログインの場合は何も表示しない
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
