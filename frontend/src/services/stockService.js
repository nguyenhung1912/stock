import { fetchApi } from "@/services/api";

const normalizeFavorite = (value) =>
  value === true || String(value) === "true";

const normalizeStock = (stock) =>
  stock
    ? {
        ...stock,
        favorite: normalizeFavorite(stock.favorite),
      }
    : stock;

export const stockService = {
  getStocks: async () => {
    const stocks = await fetchApi("/stocks");

    return stocks.map(normalizeStock);
  },

  getStockById: async (id) => normalizeStock(await fetchApi(`/stocks/${id}`)),

  create: async (stock) =>
    normalizeStock(
      await fetchApi("/stocks", {
        method: "POST",
        body: JSON.stringify(stock),
      }),
    ),

  update: async (id, stock) =>
    normalizeStock(
      await fetchApi(`/stocks/${id}`, {
        method: "PUT",
        body: JSON.stringify(stock),
      }),
    ),

  patch: async (id, partial) =>
    normalizeStock(
      await fetchApi(`/stocks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(partial),
      }),
    ),

  delete: (id) =>
    fetchApi(`/stocks/${id}`, {
      method: "DELETE",
    }),

  getExchanges: () => {
    return fetchApi("/exchanges");
  },
};
