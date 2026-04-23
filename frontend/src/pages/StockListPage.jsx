import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StockEditModal from "@/components/stocks/StockEditModal";
import StockItem from "@/components/stocks/StockItem";
import StockListHeader from "@/components/stocks/StockListHeader";
import StockListPagination from "@/components/stocks/StockListPagination";
import StockListToolbar from "@/components/stocks/StockListToolbar";
import { useDebounce } from "@/hooks/useDebounce";
import { stockService } from "@/services/stockService";
import { getTotalPages, paginate } from "@/utils/pagination";

const PAGE_SIZE = 5;

function getPageMeta(isFavoritePage) {
  if (isFavoritePage) {
    return {
      title: "Favorites",
      subtitle: "Only stocks marked as favorite.",
    };
  }

  return {
    title: "Stocks",
    subtitle: "View, search and manage stock records.",
  };
}

function getVisiblePages(activePage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(activePage - 1, totalPages - 4));
  return Array.from({ length: 5 }, (_, index) => start + index);
}

export default function StockListPage({ isFavoritePage = false }) {
  const [initialStocks] = useState(() => stockService.getCachedStocks() ?? []);
  const hasInitialStocks = initialStocks.length > 0;
  const [allStocks, setAllStocks] = useState(initialStocks);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isLoading, setIsLoading] = useState(!hasInitialStocks);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [busyStockId, setBusyStockId] = useState(null);
  const [isSavingStock, setIsSavingStock] = useState(false);

  const navigate = useNavigate();
  const debouncedSearchText = useDebounce(searchText, 300);
  const pageMeta = getPageMeta(isFavoritePage);

  const searchValue = debouncedSearchText.trim().toLowerCase();
  let filteredStocks = [...allStocks];

  if (isFavoritePage) {
    filteredStocks = filteredStocks.filter((stock) => stock.favorite);
  }

  if (searchValue) {
    filteredStocks = filteredStocks.filter(
      (stock) =>
        stock.name.toLowerCase().includes(searchValue) ||
        stock.code.toLowerCase().includes(searchValue),
    );
  }

  const totalPages = getTotalPages(filteredStocks, PAGE_SIZE);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const paginatedStocks = paginate(filteredStocks, activePage, PAGE_SIZE);
  const visiblePages = getVisiblePages(activePage, totalPages);

  async function getStocks({ background = false } = {}) {
    try {
      if (background) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      return await stockService.getStocks({ force: true });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load stocks");
      return null;
    } finally {
      if (background) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }

  async function refreshStocks() {
    const data = await getStocks({ background: true });

    if (data) {
      setAllStocks(data);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function loadInitialStocks() {
      const data = await getStocks({ background: hasInitialStocks });

      if (!ignore && data) {
        setAllStocks(data);
      }
    }

    loadInitialStocks();

    return () => {
      ignore = true;
    };
  }, [hasInitialStocks]);

  const handleSearchChange = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleViewStock = (stock) => {
    if (stock.id) {
      navigate(`/stock/${stock.id}`);
    }
  };

  const handleDeleteStock = async (stock) => {
    if (!stock?.id) return;

    if (window.confirm(`Are you sure you want to delete ${stock.code}?`)) {
      try {
        setBusyStockId(stock.id);
        await stockService.delete(stock.id);
        toast.success(`Deleted ${stock.code}`);
        setAllStocks((current) =>
          current.filter((item) => item.id !== stock.id),
        );
        setSelectedStock((current) =>
          current?.id === stock.id ? null : current,
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Delete failed!");
      } finally {
        setBusyStockId(null);
      }
    }
  };

  const handleToggleFavorite = async (stock) => {
    if (!stock.id) return;

    try {
      setBusyStockId(stock.id);
      const updatedStock = await stockService.patch(stock.id, {
        favorite: !stock.favorite,
      });
      toast.success(
        stock.favorite ? "Removed from favorites" : "Added to favorites",
      );
      setAllStocks((current) =>
        current.map((item) =>
          item.id === updatedStock.id ? updatedStock : item,
        ),
      );
      setSelectedStock((current) =>
        current?.id === updatedStock.id ? updatedStock : current,
      );
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update favorite status!");
    } finally {
      setBusyStockId(null);
    }
  };

  const handleUpdateField = (field, value) => {
    setSelectedStock((current) => {
      if (!current) return current;

      return {
        ...current,
        [field]: value,
      };
    });
  };

  const handleSaveUpdate = async () => {
    if (!selectedStock?.id) return;

    const oldStockData = allStocks.find(
      (stock) => stock.id === selectedStock.id,
    );
    const payload = { ...selectedStock };

    if (oldStockData) {
      payload.previousPrice = oldStockData.price;
    }

    try {
      setIsSavingStock(true);
      const updatedStock = await stockService.update(payload.id, payload);
      toast.success("Update successful");
      setAllStocks((current) =>
        current.map((item) =>
          item.id === updatedStock.id ? updatedStock : item,
        ),
      );
      setSelectedStock(null);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Update failed!");
    } finally {
      setIsSavingStock(false);
    }
  };

  return (
    <div className="grid gap-4">
      <StockListHeader
        isFavoritePage={isFavoritePage}
        pageMeta={pageMeta}
        onCreateStock={() => navigate("/create")}
      />

      <section className="surface-card overflow-hidden">
        <StockListToolbar
          searchText={searchText}
          totalItems={filteredStocks.length}
          isRefreshing={isRefreshing}
          onRefresh={refreshStocks}
          onSearchChange={handleSearchChange}
        />

        <div className="hidden border-b border-slate-200 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 lg:grid lg:grid-cols-[minmax(72px,.8fr)_minmax(180px,1.8fr)_minmax(110px,1fr)_minmax(140px,1.1fr)_minmax(96px,.8fr)_150px] lg:gap-4">
          <div>Code</div>
          <div>Name</div>
          <div>Previous</div>
          <div>Price</div>
          <div>Exchange</div>
          <div className="text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="px-5 py-12 text-center">
            <h3 className="text-base font-semibold text-slate-900">
              Loading stocks...
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Fetching the latest stock data from the server.
            </p>
          </div>
        ) : paginatedStocks.length > 0 ? (
          <div className="space-y-3 p-3 lg:space-y-0 lg:divide-y lg:divide-slate-200 lg:p-0">
            {paginatedStocks.map((item) => (
              <StockItem
                key={item.id}
                isBusy={busyStockId === item.id}
                stock={item}
                onView={handleViewStock}
                onUpdate={(stock) => setSelectedStock({ ...stock })}
                onDelete={handleDeleteStock}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <h3 className="text-base font-semibold text-slate-900">
              No stocks found
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Try another keyword or add a new stock.
            </p>
          </div>
        )}

        {filteredStocks.length > 0 ? (
          <StockListPagination
            activePage={activePage}
            totalPages={totalPages}
            visiblePages={visiblePages}
            onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            onSelectPage={setCurrentPage}
          />
        ) : null}
      </section>

      <StockEditModal
        stock={selectedStock}
        isSaving={isSavingStock}
        onClose={() => setSelectedStock(null)}
        onFieldChange={handleUpdateField}
        onSave={handleSaveUpdate}
      />
    </div>
  );
}
