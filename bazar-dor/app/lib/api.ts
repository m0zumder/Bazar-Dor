const BASE_URL = 'https://openapi.programming-hero.com/api/bazardor'; //[cite: 5]

// সব প্রোডাক্ট অথবা ক্যাটাগরি অনুযায়ী প্রোডাক্ট ফেচ করা
export async function getProducts(categorySlug?: string) {
  const url = categorySlug 
    ? `${BASE_URL}/products?category=${categorySlug}` 
    : `${BASE_URL}/products`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

 // নির্দিষ্ট একটি প্রোডাক্টের বিস্তারিত তথ্য ফেচ করা
export async function getProductDetails(id: string) {
  const res = await fetch(`${BASE_URL}/products/${id}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch product details');
  return res.json();
}

// ক্যাটাগরি লিস্ট ফেচ করা
export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}    