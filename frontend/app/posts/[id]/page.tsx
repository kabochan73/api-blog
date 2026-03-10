import Link from "next/link";
import { cookies } from "next/headers";
import { getPost, getPosts, getTags } from "@/lib/api";
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
  const firstTag = post.tags[0];
  const [relatedPosts, allTags] = await Promise.all([
    firstTag
      ? getPosts(1, firstTag.slug).then((r) => r.data.filter((p) => p.id !== post.id).slice(0, 4))
      : Promise.resolve([]),
    getTags(),
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6">
          <Link href="/" className="text-2xl font-bold text-zinc-900 shrink-0">
            My Output Blog
          </Link>
          <Link
            href={post.status === "draft" ? "/drafts" : "/"}
            className="text-sm text-zinc-500 hover:text-zinc-900"
          >
            ← {post.status === "draft" ? "下書き一覧に戻る" : "一覧に戻る"}
          </Link>
          <PostActions postId={post.id} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl w-full px-4 py-10 flex-1">
        <div className="grid grid-cols-4 gap-8">
        <article className="col-span-3 rounded-lg border border-zinc-200 bg-white p-8 shadow-md">
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
                  className="rounded-full px-3 py-1 text-xs text-white font-bold"
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

        {/* 目次サイドバー */}
        {(() => {
          const headings = [...post.body.matchAll(/^(#{1,3}) (.+)$/gm)].map((m) => ({
            level: m[1].length,
            text: m[2],
            id: m[2].toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
          }));
          if (headings.length === 0) return null;
          return (
            <aside className="col-span-1 flex flex-col gap-4 sticky top-6">
              <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <h2 className="text-base font-bold text-zinc-900 mb-4">目次</h2>
                <ul className="space-y-2.5">
                  {headings.map((h, i) => (
                    <li key={i} style={{ paddingLeft: `${(h.level - 1) * 12}px` }}>
                      <a
                        href={`#${h.id}`}
                        className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline line-clamp-2"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              {allTags.length > 0 && (
                <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                  <h2 className="text-base font-bold text-zinc-900 mb-4">タグ検索</h2>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((t) => (
                      <Link
                        key={t.id}
                        href={`/?tag=${t.slug}`}
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white transition-opacity hover:opacity-80"
                        style={{ backgroundColor: t.color }}
                      >
                        {t.name}
                        {t.posts_count !== undefined && (
                          <span className="opacity-75">({t.posts_count})</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {relatedPosts.length > 0 && (
                <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                  <h2 className="text-base font-bold text-zinc-900 mb-4">関連記事</h2>
                  <ul className="space-y-2.5">
                    {relatedPosts.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/posts/${p.id}`}
                          className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline line-clamp-2"
                        >
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          );
        })()}

        </div>
      </main>
      <Footer />
    </div>
  );
}
