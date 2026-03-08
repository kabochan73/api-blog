import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDrafts } from "@/lib/api";
import Header from "@/app/components/Header";
import PostActions from "@/app/components/PostActions";

export default async function DraftsPage() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/");
  }

  const drafts = await getDrafts(token);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-zinc-900">下書き一覧</h1>

        <div className="mt-6">
          {drafts.length === 0 ? (
            <p className="text-zinc-500">下書きはありません。</p>
          ) : (
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
                      <span className="rounded-full bg-sky-200 px-2 py-0.5 text-xs font-medium text-sky-600">
                        下書き
                      </span>
                    </div>
                    <PostActions postId={post.id} />
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
                    <span>{post.user.name}</span>
                    <span>·</span>
                    <span>
                      {new Date(post.created_at).toLocaleDateString("ja-JP")}
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
        </div>
      </main>
    </div>
  );
}
