import { getSupabaseClient } from "@/lib/supabase-client";
import { getCatalogCollection, type CollectionProduct } from "@/lib/collections";

const PREFIX = "NIL_PRODUCT_V1:";
export type ProductMetadata = {
  description: string;
  material: string;
  standardDimensions: string;
  details: { label: string; value: string }[];
  dimensions: { label: string; value: string }[];
  options: { label: string; values: string[] }[];
};
export type CatalogRow = {
  id: string; title: string; slug: string; description: string; image_urls: string[];
  category_id: string | null; published: boolean; sort_order: number;
};
export type CategoryRow = { id: string; name: string; slug: string };

export function decodeProductDescription(value: string | null | undefined): ProductMetadata {
  const text = value ?? "";
  const fallback: ProductMetadata = { description: text, material: "", standardDimensions: "", details: [], dimensions: [], options: [] };
  if (!text.startsWith(PREFIX)) return fallback;
  try {
    const parsed = JSON.parse(text.slice(PREFIX.length));
    if (!parsed || typeof parsed !== "object") return fallback;
    const validPairs = (items: unknown) => Array.isArray(items) ? items.filter((p): p is {label:string;value:string} => p && typeof p.label === "string" && typeof p.value === "string") : [];
    return {
      description: typeof parsed.description === "string" ? parsed.description : "",
      material: typeof parsed.material === "string" ? parsed.material : "",
      standardDimensions: typeof parsed.standardDimensions === "string" ? parsed.standardDimensions : "",
      details: validPairs(parsed.details),
      dimensions: validPairs(parsed.dimensions),
      options: Array.isArray(parsed.options) ? parsed.options.filter((o: {label?:unknown; values?:unknown}) => o && typeof o.label === "string" && Array.isArray(o.values) && o.values.every((v:unknown)=>typeof v==="string")) : [],
    };
  } catch { return fallback; }
}
export function encodeProductDescription(data: ProductMetadata): string {
  return PREFIX + JSON.stringify(data);
}

export function mapLiveProduct(row: CatalogRow, category: CategoryRow | undefined): CollectionProduct & { slug: string } {
  const meta = decodeProductDescription(row.description);
  return {
    name: row.title,
    slug: row.slug,
    category: category?.name || "Diğer",
    image: row.image_urls?.[0] || "/urunler/yakinda.svg",
    gallery: row.image_urls?.slice(1) ?? [],
    material: meta.material || category?.name || "Ürün özellikleri teklif sırasında netleştirilir.",
    productInfo: meta.description,
    standardDimensions: meta.standardDimensions,
    dimensions: meta.dimensions,
    details: meta.details,
    options: meta.options,
  };
}
export async function fetchPublishedProducts(): Promise<{products: (CollectionProduct & {slug:string})[]; categories: CategoryRow[]}> {
  const db = getSupabaseClient();
  if (!db) return { products: [], categories: [] };
  const [p,c] = await Promise.all([
    db.from("products").select("id,title,slug,description,image_urls,published,category_id,sort_order").eq("published", true).order("sort_order"),
    db.from("categories").select("id,name,slug")
  ]);
  if (p.error || c.error) throw new Error(p.error?.message || c.error?.message || "Katalog alınamadı");
  const categories = (c.data || []) as CategoryRow[];
  return { categories, products: ((p.data || []) as CatalogRow[]).map(row => mapLiveProduct(row,categories.find(cat => cat.id === row.category_id))) };
}
/** Once Supabase categories exist, published database products are the source of truth.
 * This prevents unpublished imported items from leaking through the old static catalog.
 * The old catalog remains a fallback only before Supabase is configured or migrated.
 */
export function mergeCatalogProducts(collectionSlug: string, liveProducts: (CollectionProduct & {slug:string})[], categories: CategoryRow[]): CollectionProduct[] {
  if (!categories.length) return getCatalogCollection(collectionSlug)?.products ?? [];
  return liveProducts.filter(product => {
    if (collectionSlug === "tum-urunler") return true;
    const category = categories.find(item => item.name === product.category);
    return category?.slug === collectionSlug;
  });
}
