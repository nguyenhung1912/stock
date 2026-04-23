import { fetchApi } from "@/services/api";

let stocksCache = null;
let exchangesCache = null;

const normalizeFavorite = (value) =>
  value === true || String(value) === "true";

const normalizeStock = (stock) =>
  stock
    ? {
        ...stock,
        favorite: normalizeFavorite(stock.favorite),
      }
    : stock;

const cloneStocks = (stocks) => stocks.map((stock) => ({ ...stock }));

const setStocksCache = (stocks) => {
  stocksCache = cloneStocks(stocks.map(normalizeStock));
  return cloneStocks(stocksCache);
};

const upsertStockCache = (stock) => {
  const normalizedStock = normalizeStock(stock);

  if (!normalizedStock) {
    return normalizedStock;
  }

  if (!stocksCache) {
    stocksCache = [normalizedStock];
    return { ...normalizedStock };
  }

  const nextStocks = cloneStocks(stocksCache);
  const targetIndex = nextStocks.findIndex((item) => item.id === normalizedStock.id);

  if (targetIndex >= 0) {
    nextStocks[targetIndex] = normalizedStock;
  } else {
    nextStocks.unshift(normalizedStock);
  }

  stocksCache = nextStocks;
  return { ...normalizedStock };
};

const removeStockCache = (stockId) => {
  if (!stocksCache) {
    return;
  }

  stocksCache = stocksCache.filter((stock) => stock.id !== stockId);
};

export const stockService = {
  getCachedStocks: () => (stocksCache ? cloneStocks(stocksCache) : null),
  getCachedStockById: (id) =>
    stocksCache
      ? (() => {
          const stock = stocksCache.find((item) => item.id === id);
          return stock ? { ...stock } : null;
        })()
      : null,

  getStocks: async ({ force = false } = {}) => {
    if (!force && stocksCache) {
      return cloneStocks(stocksCache);
    }

    const stocks = await fetchApi("/stocks");
    return setStocksCache(stocks);
  },

  getStockById: async (id) => normalizeStock(await fetchApi(`/stocks/${id}`)),

  create: async (stock) =>
    upsertStockCache(
      await fetchApi("/stocks", {
        method: "POST",
        body: JSON.stringify(stock),
      }),
    ),

  update: async (id, stock) =>
    upsertStockCache(
      await fetchApi(`/stocks/${id}`, {
        method: "PUT",
        body: JSON.stringify(stock),
      }),
    ),

  patch: async (id, partial) =>
    upsertStockCache(
      await fetchApi(`/stocks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(partial),
      }),
    ),

  delete: async (id) => {
    const response = await fetchApi(`/stocks/${id}`, {
      method: "DELETE",
    });

    removeStockCache(id);
    return response;
  },

  getExchanges: async ({ force = false } = {}) => {
    if (!force && exchangesCache) {
      return exchangesCache.map((exchange) => ({ ...exchange }));
    }

    const exchanges = await fetchApi("/exchanges", { auth: false });
    exchangesCache = exchanges.map((exchange) => ({ ...exchange }));
    return exchangesCache.map((exchange) => ({ ...exchange }));
  },
};
