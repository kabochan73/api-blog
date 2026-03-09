import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDrafts } from "@/lib/api";
import { formatDate } from "@/lib/date";
import Header from "@/app/components/Header";
import PostActions from "@/app/components/PostActions";

type Props = {
  searchParams: Promise<{ search?: string }>;
};

export default async function DraftsPage({ searchParams }: Props) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/");
  }

  const { search } = await searchParams;
  const allDrafts = await getDrafts(token);
  const drafts = search
    ? allDrafts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.body.toLowerCase().includes(search.toLowerCase())
      )
    : allDrafts;

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-zinc-900">下書き一覧</h1>

        <div className="mt-6">
          {drafts.length === 0 ? (
            <div className="space-y-3">
              <p className="text-zinc-500">下書きはありません。</p>
              {search && (
                <Link href="/drafts" className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900">
                  ← 下書き一覧に戻る
                </Link>
              )}
            </div>
          ) : (
            <>
              {search && (
                <div className="mb-6">
                  <Link href="/drafts" className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900">
                    ← 下書き一覧に戻る
                  </Link>
                </div>
              )}
              <ul className="space-y-6">
                {drafts.map((post) => (
                  <li key={post.id} className="rounded-lg bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/posts/${post.id}`} className="group">
                          <h2 className="text-xl font-semibold text-zinc-900 group-hover:text-blue-600">
                            {post.title}
                          </h2>
                        </Link>
                      </div>
                      <PostActions postId={post.id} />
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
                      <span>{post.user.name}</span>
                      <span>·</span>
                      <span>{formatDate(post.created_at)}</span>
                      <span className="rounded-full bg-sky-200 px-2 py-0.5 text-xs font-medium text-sky-600">
                        下書き
                      </span>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
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
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
