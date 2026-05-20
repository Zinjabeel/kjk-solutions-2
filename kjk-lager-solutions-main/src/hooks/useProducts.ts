import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts, type CatalogProduct } from "@/lib/catalog";

export function useProducts(query?: string) {
  return useQuery<CatalogProduct[]>({
    queryKey: ["products", query ?? "__all"],
    queryFn: () => fetchAllProducts({ query }),
    staleTime: 5 * 60_000,
  });
}
