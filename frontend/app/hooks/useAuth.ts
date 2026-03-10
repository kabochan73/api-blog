"use client";

import { useState } from "react";

// ログイン状態の管理とログアウト処理をまとめたカスタムフック
// Header・PostActions など複数コンポーネントで共通利用する
export function useAuth() {
  // SSR時はwindowが存在しないためfalseを返す。クライアントではlocalStorageのtokenで判定
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  });

  // localStorageとcookieの両方からtokenを削除してログアウト
  function logout() {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    setIsLoggedIn(false);
  }

  return { isLoggedIn, logout };
}
