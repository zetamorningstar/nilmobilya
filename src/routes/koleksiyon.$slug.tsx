import { createFileRoute, notFound } from "@tanstack/react-router";

import { CollectionCatalog } from "@/components/collection-catalog";
import { getCatalogCollection } from "@/lib/collections";

export const Route = createFileRoute("/koleksiyon/$slug")({
  loader: ({ params }) => {
    const collection = getCatalogCollection(params.slug);
    if (!collection) throw notFound();
    return { collection };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Koleksiyon bulunamadı | Nil Mobilya" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { collection } = loaderData;
    const canonical = `https://nilmobilyatasarim.com/koleksiyon/${collection.slug}`;
    return {
      meta: [
        { title: `Nil Mobilya | ${collection.pageTitle}` },
        { name: "description", content: collection.lead },
        { property: "og:title", content: `Nil Mobilya | ${collection.pageTitle}` },
        { property: "og:description", content: collection.lead },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        { property: "og:image", content: "https://nilmobilyatasarim.com/images/koleksiyon/tum-urunler.webp" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: CollectionRoute,
});

function CollectionRoute() {
  const { collection } = Route.useLoaderData();
  return <CollectionCatalog key={collection.slug} collection={collection} />;
}
