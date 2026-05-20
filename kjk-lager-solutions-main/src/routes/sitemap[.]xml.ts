import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { CATEGORIES } from "@/data/categories";
import products from "@/data/products.json";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/produkter", priority: "0.9", changefreq: "daily" },
          { path: "/begagnat", priority: "0.9", changefreq: "weekly" },
          ...CATEGORIES.map((c) => ({
            path: `/kategori/${c.slug}`,
            priority: "0.8",
            changefreq: "weekly",
          })),
        ];

        const productPaths = (products as { slug: string }[]).map((p) => ({
          path: `/produkt/${p.slug}`,
          priority: "0.6",
          changefreq: "monthly",
        }));

        const all = [...staticPaths, ...productPaths];
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...all.map(
            (p) =>
              `  <url><loc>${BASE_URL}${p.path}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`,
          ),
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
