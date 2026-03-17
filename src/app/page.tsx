import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Sidebar from "./conponents/sideBar";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const categoryParam = Array.isArray(params?.category)
    ? params.category[0]
    : params?.category;
  const minParam = Array.isArray(params?.min) ? params.min[0] : params?.min;
  console.log("raw category param:", JSON.stringify(categoryParam));
  const pageParam = Array.isArray(params?.page) ? params.page[0] : params?.page;
  //  type Item = {
  //   id: number;
  //   title: string;
  //   category: string;
  //   salary: number;
  // };
  let q = supabase
    .from("posts")
    .select("id, title, category, salary", { count: "exact" });

  const category = categoryParam?.trim();
  const min = minParam?.trim() ? Number(minParam) : null;
  const pageNum = pageParam ? Math.max(1, Number(pageParam)) : 1;

  const pageSize = 10;
  const from = (pageNum - 1) * pageSize;
  const to = from + pageSize - 1;

  if (category) q = q.ilike("category", `%${category}%`);
  if (min !== null && Number.isFinite(min)) q = q.gte("salary", min);

  const { data, error, count } = await q
    .order("id", { ascending: false })
    .range(from, to);
  if (error) {
    console.error(error);
    return <div>データの取得に失敗しました</div>;
  }
  console.log(data);
  const total = count ?? data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const buildHref = (p: number) => {
    const q = new URLSearchParams();
    if (category) q.set("category", category);
    if (minParam) q.set("min", String(minParam));
    q.set("page", String(p));
    return "/?" + q.toString();
  };
  return (
    <div>
      <h1>求人検索アプリ</h1>
      <Link href="/">求人検索</Link>
      <Link href="/post">求人投稿</Link>
      <Sidebar initial={{ category: categoryParam, min: minParam }} />
      <h2>求人一覧</h2>
      <h2>該当件数:{total}件</h2>
      {data?.map((post) => (
        <div key={post.id}>
          <p>{post.title}</p>
          <p>カテゴリ：{post.category}</p>
          <p>年収：{post.salary}万円</p>
        </div>
      ))}
      <nav style={{ marginTop: 16 }}>
        {pageNum > 1 && <Link href={buildHref(pageNum - 1)}>◀</Link>}{" "}
        {[...Array(totalPages)].map((_, i) => {
          const p = i + 1;
          return (
            <Link
              key={p}
              href={buildHref(p)}
              style={{
                margin: "0 6px",
                fontWeight: p === pageNum ? "bold" : "normal",
              }}
            >
              {p}
            </Link>
          );
        })}{" "}
        {pageNum < totalPages && <Link href={buildHref(pageNum + 1)}>▶</Link>}
      </nav>
    </div>
  );
}
