// サーバーサイド（Docker内）: API_URL、クライアントサイド（ブラウザ）: NEXT_PUBLIC_API_URL
const API_BASE_URL =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export type Post = {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  body: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
  tags: Tag[];
};

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message ?? "ログインに失敗しました");
  }
  const data = await res.json();
  return data.token;
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_BASE_URL}/posts`, { cache: "no-store" });
  if (!res.ok) throw new Error("投稿一覧の取得に失敗しました");
  return res.json();
}

export async function getDrafts(token: string): Promise<Post[]> {
  const res = await fetch(`${API_BASE_URL}/posts`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("下書き一覧の取得に失敗しました");
  const posts: Post[] = await res.json();
  return posts.filter((p) => p.status === "draft");
}

export async function getPost(id: number, token?: string): Promise<Post> {
  const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("投稿が見つかりません");
  return res.json();
}

export async function getTags(): Promise<Tag[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`);
  if (!res.ok) throw new Error("タグ一覧の取得に失敗しました");
  return res.json();
}

export async function createPost(
  data: { title: string; body: string; status: "draft" | "published"; tag_ids: number[] },
  token: string
): Promise<Post> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "投稿の作成に失敗しました");
  }
  return res.json();
}
