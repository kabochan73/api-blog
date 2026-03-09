import Link from "next/link";
import { cookies } from "next/headers";
import { getPost } from "@/lib/api";
import PostActions from "@/app/components/PostActions";
import Footer from "@/app/components/Footer";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const token = (await cookies()).get("token")?.value;
  const post = await getPost(Number(id), token);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
            ← 一覧に戻る
          </Link>
          <PostActions postId={post.id} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl w-full px-4 py-10 flex-1">
        <article className="rounded-lg border border-zinc-200 bg-white p-8">
          <h1 className="text-3xl font-bold text-zinc-900">{post.title}</h1>

          <div className="mt-3 flex items-center gap-3 text-sm text-zinc-500">
            <span>{post.user.name}</span>
            <span>·</span>
            <span>
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString("ja-JP")
                : new Date(post.created_at).toLocaleDateString("ja-JP")}
            </span>
          </div>

          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 whitespace-pre-wrap text-zinc-700 leading-8">
            {post.body}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
