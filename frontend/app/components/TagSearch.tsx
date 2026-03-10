import Link from "next/link";
import { Tag } from "@/lib/api";

type Props = {
  tags: Tag[];
};

export default function TagSearch({ tags }: Props) {
  if (tags.length === 0) return null;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-bold text-zinc-900 mb-4">タグ検索</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
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
  );
}
