import Link from "next/link";
import { getPosts } from "@/lib/api";
import Header from "@/app/components/Header";
import PostActions from "@/app/components/PostActions";
import Footer from "@/app/components/Footer";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const { data: posts, last_page } = await getPosts(currentPage);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Header />

      <main className="mx-auto max-w-3xl w-full px-4 py-10 flex-1">
        {posts.length === 0 ? (
          <p className="text-zinc-500">投稿がまだありません。</p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.id} className="rounded-lg border border-zinc-200 bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/posts/${post.id}`} className="group">
                    <h2 className="text-xl font-semibold text-zinc-900 group-hover:text-blue-600">
                      {post.title}
                    </h2>
                  </Link>
                  <PostActions postId={post.id} />
                </div>
                <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
                  <span>{post.user.name}</span>
                  <span>·</span>
                  <span>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("ja-JP")
                      : new Date(post.created_at).toLocaleDateString("ja-JP")}
                  </span>
                </div>
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
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
              </li>
            ))}
          </ul>
        )}

        {last_page > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/?page=${currentPage - 1}`}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                前へ
              </Link>
            )}
            {Array.from({ length: last_page }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/?page=${p}`}
                className={`rounded-md px-4 py-2 text-sm ${
                  p === currentPage
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {p}
              </Link>
            ))}
            {currentPage < last_page && (
              <Link
                href={`/?page=${currentPage + 1}`}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                次へ
              </Link>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
