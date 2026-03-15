import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

const categories = [
  "事務",
  "営業",
  "エンジニア",
  "デザイン",
  "マーケティング",
  "財務・経理",
  "人事",
  "カスタマーサポート",
  "製造",
  "医療・介護",
];

export default function PostPage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const title = String(formData.get("title")).trim();
    const category = String(formData.get("category")).trim();
    const salary = Number(formData.get("salary"));

    if (!title || !category || !salary) {
      throw new Error("すべての項目を入力してください");
    }
    const { error } = await supabaseServer.from("posts").insert({
      title,
      category,
      salary,
    });
    if (error) {
      throw new Error("求人投稿に失敗しました");
    }
    redirect("/"); // 投稿後に求人検索ページに画面遷移
  }

  return (
    <div>
      <h1>求人検索アプリ</h1>
      <Link href="/">求人検索</Link>
      <Link href="/post">求人投稿</Link>
      <h1>求人投稿</h1>
      <form action={handleSubmit}>
        <label>
          タイトル
          <input type="text" name="title" required />
        </label>

        <label>
          カテゴリ
          <select name="category" required defaultValue="">
            <option value="">選択してください</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <label>
          年収
          <input type="number" name="salary" required />
        </label>
        <button type="submit">投稿</button>
      </form>
    </div>
  );
}
