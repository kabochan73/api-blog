# My Output Blog

技術学習の記録を投稿するブログアプリです。

## 技術スタック

- **フロントエンド**: Next.js / TypeScript / Tailwind CSS
- **バックエンド**: Laravel
- **データベース**: MySQL
- **インフラ**: AWS EC2 / Vercel
- **開発環境**: Docker

## 主な機能

- 記事の作成・編集・削除（マークダウン対応）
- 下書き保存
- タグによる絞り込み
- キーワード検索
- 目次の自動生成
- 関連記事の表示

## ローカル環境の起動

```bash
# コンテナ起動
docker-compose up -d

# フロントエンド起動
cd frontend
npm install
npm run dev
```

フロントエンド: http://localhost:3000
バックエンドAPI: http://localhost:8000/api
