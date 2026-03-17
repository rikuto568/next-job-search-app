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
    <aside
      style={{ padding: 12, borderRight: "1px solid #eee", minWidth: 200 }}
    >
      <div>
        <strong>カテゴリ</strong>
        {CATEGORIES.map((c) => (
          <label key={c} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selected === c}
              onChange={() => setSelected(selected === c ? "" : c)}
            />{" "}
            {c}
          </label>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <label>
          <strong>最低年収（万円）</strong>
          <div>
            <select value={min} onChange={(e) => setMin(e.target.value)}>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
              <option value="700">700</option>
              <option value="800">800</option>
            </select>
          </div>
        </label>
      </div>
    </aside>
  );
}
