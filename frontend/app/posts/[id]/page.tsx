import Link from "next/link";
import { cookies } from "next/headers";
import { getPost } from "@/lib/api";
import PostActions from "@/app/components/PostActions";
import Footer from "@/app/components/Footer";
import MarkdownContent from "@/app/components/MarkdownContent";
import { formatDate } from "@/lib/date";

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
          <Link href={post.status === "draft" ? "/drafts" : "/"} className="text-sm text-zinc-500 hover:text-zinc-900">
            ← {post.status === "draft" ? "下書き一覧に戻る" : "一覧に戻る"}
          </Link>
          <PostActions postId={post.id} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl w-full px-4 py-10 flex-1">
        <article className="rounded-lg border border-zinc-200 bg-white p-8 shadow-md">
          <h1 className="text-3xl font-bold text-zinc-900">{post.title}</h1>

          <div className="mt-3 flex items-center gap-3 text-sm text-zinc-500">
            <span>{post.user.name}</span>
            <span>·</span>
            <span>
              {formatDate(post.published_at ?? post.created_at)}
            </span>
          </div>

          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full px-3 py-1 text-xs text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8">
            <MarkdownContent content={post.body} />
          </div>

          <div className="mt-10 border-t border-zinc-100 pt-6">
            <Link href={post.status === "draft" ? "/drafts" : "/"} className="text-sm text-zinc-500 hover:text-zinc-900 flex justify-end">
              ← {post.status === "draft" ? "下書き一覧に戻る" : "一覧に戻る"}
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
