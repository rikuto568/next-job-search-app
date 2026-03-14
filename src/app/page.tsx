import { supabase } from "@/lib/supabase";

export default async function Page() {
  const { data } = await supabase.from("posts").select("*");
  console.log(data);

  return (
    <div>
      <h1>求人</h1>

      {data?.map((post) => (
        <div key={post.id}>
          <p>{post.title}</p>
          <p>{post.salary}円</p>
        </div>
      ))}
    </div>
  );
}
