import Link from "next/link";

export default function PostPage() {
  return (
    <div>
      <h1>求人検索アプリ</h1>
      <Link href="/">求人検索</Link>
      <Link href="/post">求人投稿</Link>
      <h1>求人投稿</h1>
      <p>求人投稿フォームをここに実装します</p>
    </div>
  );
}
