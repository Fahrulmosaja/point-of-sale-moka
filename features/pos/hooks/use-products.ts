import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Product } from "@/types/product.types";
import { usePosStore } from "@/stores/pos-store";
import { useEffect } from "react";

export function useProducts() {
  const setFavorites = usePosStore((state) => state.setFavorites);

  const query = useQuery<Product[]>({
    queryKey: ["product-menus"],
    queryFn: async () => {
      const response = await api.get("/product-menus?active=true");
      return response.data;
    },
  });

  useEffect(() => {
    if (query.data) {
      setFavorites(query.data.filter((p) => p.isFavorite).map((p) => p.id));
    }
  }, [query.data, setFavorites]);

  return query;
}
