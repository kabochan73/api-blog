import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white">
      <p className="text-8xl font-bold text-zinc-900">404</p>
      <p className="text-xl text-zinc-600">ページが見つかりませんでした</p>
      <Link
        href="/"
        className="rounded-md bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
      >
        ホームに戻る
      </Link>
    </div>
  );
}
