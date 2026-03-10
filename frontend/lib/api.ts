// APIのベースURL
// サーバーサイド（Docker内）: API_URL、クライアントサイド（ブラウザ）: NEXT_PUBLIC_API_URL
const API_BASE_URL =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

// タグの型定義
export type Tag = {
  id: number;
  name: string;
  slug: string;       // URL用のスラッグ（英数字のみ）
  color: string;      // カラーコード（例: #3b82f6）
  posts_count?: number; // タグに紐づく投稿数（タグ一覧取得時のみ含まれる）
};

// 投稿の型定義
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

// ページネーションレスポンスの型定義（汎用）
export type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
};

// ログイン：tokenを返す
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

// 投稿一覧を取得（ページネーション・タグ・キーワード絞り込み対応）
export async function getPosts(page = 1, tag?: string, search?: string): Promise<PaginatedResponse<Post>> {
  const params = new URLSearchParams({ page: String(page) });
  if (tag) params.set("tag", tag);
  if (search) params.set("search", search);
  const res = await fetch(`${API_BASE_URL}/posts?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error("投稿一覧の取得に失敗しました");
  return res.json();
}

// 下書き一覧を全ページ取得（ページネーションをループで解決）
export async function getDrafts(token: string): Promise<Post[]> {
  const drafts: Post[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(`${API_BASE_URL}/posts?status=draft&page=${page}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("下書き一覧の取得に失敗しました");
    const paginated: PaginatedResponse<Post> = await res.json();
    drafts.push(...paginated.data);
    if (page >= paginated.last_page) break;
    page++;
  }

  return drafts;
}

// 投稿1件を取得（tokenがあれば下書きも取得可能）
export async function getPost(id: number, token?: string): Promise<Post> {
  const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("投稿が見つかりません");
  return res.json();
}

// タグ一覧を取得
export async function getTags(): Promise<Tag[]> {
  const res = await fetch(`${API_BASE_URL}/tags`);
  if (!res.ok) throw new Error("タグ一覧の取得に失敗しました");
  return res.json();
}

// タグを新規作成
export async function createTag(name: string, color: string, token: string): Promise<Tag> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, color }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "タグの作成に失敗しました");
  }
  return res.json();
}

// タグを削除
export async function deleteTag(id: number, token: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("タグの削除に失敗しました");
}

// 投稿を削除
export async function deletePost(id: number, token: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("投稿の削除に失敗しました");
}

// 投稿を更新（タイトル・本文・ステータス・タグを変更可能）
export async function updatePost(
  id: number,
  data: { title: string; body: string; status: "draft" | "published"; tag_ids: number[] },
  token: string
): Promise<Post> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "投稿の更新に失敗しました");
  }
  return res.json();
}

// 投稿を新規作成
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
