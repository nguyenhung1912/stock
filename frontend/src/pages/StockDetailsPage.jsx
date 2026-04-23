import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiMinus,
  FiStar,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { stockService } from "@/services/stockService";
import { formatCurrency } from "@/utils/formatters";

export default function StockDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cachedStock = id ? stockService.getCachedStockById(id) : null;

  const [stock, setStock] = useState(cachedStock);
  const [loading, setLoading] = useState(!cachedStock);

  useEffect(() => {
    setStock(cachedStock);
    setLoading(!cachedStock);

    if (!id) {
      navigate("/stocks");
      return;
    }

    const fetchStock = async () => {
      try {
        const data = await stockService.getStockById(id);
        setStock(data);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to load stock details");
        navigate("/stocks");
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [id, navigate]);

  const quoteData = useMemo(() => {
    if (!stock) return null;

    const priceDiff = Number(stock.price || 0) - Number(stock.previousPrice || 0);
    const changePercent = stock.previousPrice
      ? (priceDiff / stock.previousPrice) * 100
      : 0;
    const TrendIcon =
      priceDiff > 0 ? FiTrendingUp : priceDiff < 0 ? FiTrendingDown : FiMinus;
    const toneClass =
      priceDiff > 0
        ? "badge-positive"
        : priceDiff < 0
          ? "badge-negative"
          : "";

    return {
      priceDiff,
      changePercent,
      TrendIcon,
      toneClass,
    };
  }, [stock]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <div className="surface-card p-6 text-sm text-slate-500">
          Loading stock details...
        </div>
      </div>
    );
  }

  if (!stock || !quoteData) return null;

  const { TrendIcon, toneClass, changePercent } = quoteData;
  const changeLabel = `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(2)}%`;

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="page-header">
          <span className="page-eyebrow">Stocks</span>
          <h1 className="page-title">
            {stock.name} ({stock.code.toUpperCase()})
          </h1>
          <p className="page-subtitle">Stock detail from the backend.</p>
        </div>

        <button
          type="button"
          className="btn-secondary w-full sm:w-auto"
          onClick={() => navigate("/stocks")}
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section className="surface-card p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface-soft p-4">
              <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Current price
              </div>
              <div className="mt-2 text-xl font-semibold text-slate-900">
                {formatCurrency(stock.price)}
              </div>
            </div>

            <div className="surface-soft p-4">
              <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Previous price
              </div>
              <div className="mt-2 text-xl font-semibold text-slate-900">
                {formatCurrency(stock.previousPrice)}
              </div>
            </div>

            <div className="surface-soft p-4">
              <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Exchange
              </div>
              <div className="mt-2 text-sm font-medium text-slate-700">
                {stock.exchange}
              </div>
            </div>

            <div className="surface-soft p-4">
              <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Favorite
              </div>
              <div className="mt-2 text-sm font-medium text-slate-700">
                {stock.favorite ? "Yes" : "No"}
              </div>
            </div>
          </div>
        </section>

        <aside className="surface-card p-5 sm:p-6">
          <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
            Change
          </div>
          <div className="mt-3 inline-flex items-center gap-2 text-2xl font-semibold text-slate-900">
            <TrendIcon />
            <span>{changeLabel}</span>
          </div>

          <div className={`badge mt-4 ${toneClass}`}>
            <TrendIcon />
            <span>{changeLabel}</span>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
            <FiStar />
            <span>{stock.favorite ? "In favorites" : "Not in favorites"}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
