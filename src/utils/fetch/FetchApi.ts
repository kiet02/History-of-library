export interface HpBook {
  number: number;
  title: string;
  originalTitle: string;
  releaseDate: string; // ví dụ "Jul 21, 2007" – để string, parse thành Date khi cần
  description: string;
  pages: number;
  cover: string; // URL ảnh bìa
  index: number;
}

export interface Product {
  id: string;
  name: string;
  data: {
    Generation: string;
    Price: number;
    Capacity: string;
  };
}

export async function fetchPosts(): Promise<HpBook[]> {
  const res = await fetch(`https://potterapi-fedeperin.vercel.app/en/books`);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchPhone(): Promise<Product[]> {
  const res = await fetch(`https://api.restful-api.dev/objects`);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}
