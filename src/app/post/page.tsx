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
      <header className="bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">求人検索アプリ</h1>
          <nav className="items-center space-x-4">
            <Link href="/" className="text-sm hover:underline">
              求人検索
            </Link>
            <Link href="/post" className="text-sm hover:underline">
              求人投稿
            </Link>
          </nav>
        </div>
      </header>
      <main className="w-full px-8 my-4 rounded-lg mt- ">
        <h2 className="text-2xl font-semibold mb-6">求人投稿</h2>
        <form action={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            求人カテゴリ選択
          </label>
          <select
            name="category"
            required
            defaultValue=""
            className="w-2/5 border border-gray-300 rounded-md  mb-3 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus-ring-sky-300 hover:bg-gray-50"
          >
            <option value="">カテゴリを選択</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            年収（万円）
          </label>
          <input
            type="number"
            name="salary"
            required
            className="w-2/5 border border-gray-300 rounded-md  mb-3 px-3 py-2 text-sm focus:outline-none focus:ring-sky-300 hover:bg-gray-50"
          />
          <label className="block text-sm font-medium text-gray-700 mb-3">
            求人タイトル
          </label>
          <input
            type="text"
            name="title"
            required
            className="w-4/5 border border-gray-300 rounded-md  mb-3 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 hover:bg-gray-50"
          />
          <div className="pt-6">
            <button
              type="submit"
              className="w-2/5 bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-50 transition"
            >
              投稿
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
