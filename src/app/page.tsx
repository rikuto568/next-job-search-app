import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function Page() {
  type Item = {
    id: number;
    title: string;
    category: string;
    salary: number;
  };
  const { data, error } = await supabase
    .from<"posts", Item>("posts")
    .select("id, title, category, salary");
  if (error) {
    console.error(error);
    return <div>データの取得に失敗しました</div>;
  }
  console.log(data);

  return (
    <div>
      <h1>求人検索アプリ</h1>
      <Link href="/">求人検索</Link>
      <Link href="/post">求人投稿</Link>

      <h2>求人一覧</h2>
      <h2>該当件数:{data?.length}件</h2>

      {data?.map((post) => (
        <div key={post.id}>
          <p>{post.title}</p>
          <p>カテゴリ：{post.category}</p>
          <p>年収：{post.salary}万円</p>
        </div>
      ))}
    </div>
  );
}
