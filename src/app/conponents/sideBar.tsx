"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "事務",
  "エンジニア",
  "営業",
  "デザイン",
  "マーケティング",
  "財務・経理",
  "人事",
  "カスタマーサポート",
  "製造",
  "医療・介護",
];

export default function Sidebar({
  initial,
}: {
  initial?: { category?: string; min?: string };
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string>(initial?.category ?? "");
  const [min, setMin] = useState(initial?.min ?? "");
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (selected) params.set("category", selected);
      if (min) params.set("min", min);
      router.push("/?" + params.toString());
    }, 300);
    return () => clearTimeout(t);
  }, [selected, min, router]);

  return (
    <div className="max-w-6xl h-full self-stretch">
      <aside className="w-40 bg-gray-200 p-4 h-full">
        <fieldset>
          <legend className="font-semibold mb-2">求人カテゴリ</legend>
          {CATEGORIES.map((c) => (
            <label key={c} className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={selected === c}
                onChange={() => setSelected(selected === c ? "" : c)}
                className="appearance-none h-3 w-3 border border-sky-300 bg-gray-100 shadow-sm rounded-none focus:outline-none focus:ring-2 focus:ring-slate-300 checked:bg-slate-700 checked:border-slate-700"
              />{" "}
              {c}
            </label>
          ))}
        </fieldset>
        <div>
          <h3 className="font-semibold mb-2">年収</h3>
          <select
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2-slate-300"
          >
            <option value="300">300万円以上▼</option>
            <option value="400">400万円以上</option>
            <option value="500">500万円以上</option>
            <option value="600">600万円以上</option>
            <option value="700">700万円以上</option>
          </select>
        </div>
      </aside>
    </div>
  );
}
