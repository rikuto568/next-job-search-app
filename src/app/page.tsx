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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
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
      <main style={{ display: "flex", alignItems: "stretch", flex: 1 }}>
        <Sidebar initial={{ category: categoryParam, min: minParam }} />
        <section className="p-6 flex-1 flex flex-col">
          <h2 className="text-xl font-bold">求人一覧</h2>
          <h2 className="text-xs">該当件数:{total}件</h2>
          <div className="mt-4 grid gap-4">
            {data?.map((post) => (
              <div
                key={post.id}
                className="w-full border border-gray-200 rounded-md bg-white p-4 hover:shadow-md transition-shadow duration-150 cursor-pointer focus-within:ring-2 focus-within:ring-slate-200"
              >
                <h3 className="font-semibold text-sm text-gray-900 mb-1">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-600">カテゴリ：{post.category}</p>
                <p className="text-xs text-gray-600">年収：{post.salary}万円</p>
              </div>
            ))}
          </div>
          <nav className="flex items-center justify-center gap-0 mt-auto pt-4">
            {pageNum > 1 && (
              <Link
                href={buildHref(pageNum - 1)}
                className="px-0.5 py-0.5 rounded disabled:opacity-50 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
              >
                ◀
              </Link>
            )}{" "}
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              return (
                <Link
                  key={p}
                  href={buildHref(p)}
                  className={`mx-0 px-0.5 py-0.5 rounded ${p === pageNum ? "font-bold" : "font-normal"}`}
                >
                  {p}
                </Link>
              );
            })}{" "}
            {pageNum < totalPages && (
              <Link
                href={buildHref(pageNum + 1)}
                className="px-0.5 py-0.5 rounded disabled:opacity-50 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
              >
                ▶
              </Link>
            )}
          </nav>
        </section>
      </main>
    </div>
  );
}
