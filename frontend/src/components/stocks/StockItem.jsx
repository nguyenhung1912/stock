import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiEdit2,
  FiEye,
  FiMinus,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import { formatCurrency } from "@/utils/formatters";

const mobileLabelClass =
  "text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500 md:hidden";

export default function StockItem({
  stock,
  isBusy = false,
  onView,
  onUpdate,
  onDelete,
  onToggleFavorite,
}) {
  const priceDiff = Number(stock.price || 0) - Number(stock.previousPrice || 0);
  const changePercent = stock.previousPrice
    ? (priceDiff / stock.previousPrice) * 100
    : 0;

  const TrendIcon =
    priceDiff > 0 ? FiArrowUpRight : priceDiff < 0 ? FiArrowDownRight : FiMinus;

  const trendTone =
    priceDiff > 0
      ? {
          text: "text-emerald-700",
          badge: "badge-positive",
          change: `+${changePercent.toFixed(2)}%`,
        }
      : priceDiff < 0
        ? {
            text: "text-rose-700",
            badge: "badge-negative",
            change: `${changePercent.toFixed(2)}%`,
          }
        : {
            text: "text-slate-700",
            badge: "",
            change: "0.00%",
          };

  return (
    <div
      className={`grid gap-3 rounded-xl border border-slate-200 bg-white p-4 transition sm:grid-cols-2 lg:grid-cols-[minmax(72px,.8fr)_minmax(180px,1.8fr)_minmax(110px,1fr)_minmax(140px,1.1fr)_minmax(96px,.8fr)_150px] lg:items-center lg:rounded-none lg:border-0 lg:bg-transparent lg:px-5 ${isBusy ? "opacity-70" : ""}`}
    >
      <div className="grid gap-1">
        <span className={mobileLabelClass}>Code</span>
        <strong className="text-sm font-semibold tracking-[0.01em] text-slate-900">
          {stock.code.toUpperCase()}
        </strong>
      </div>

      <div className="grid gap-1 sm:col-span-2 lg:col-span-1">
        <span className={mobileLabelClass}>Name</span>
        <span className="text-sm text-slate-700">{stock.name}</span>
      </div>

      <div className="grid gap-1">
        <span className={mobileLabelClass}>Previous</span>
        <span className="text-sm text-slate-600">
          {formatCurrency(stock.previousPrice)}
        </span>
      </div>

      <div className="grid gap-1.5">
        <span className={mobileLabelClass}>Price</span>
        <strong className={`text-sm font-semibold ${trendTone.text}`}>
          {formatCurrency(stock.price)}
        </strong>
        <span className={`badge w-fit ${trendTone.badge}`}>
          <TrendIcon />
          <span>{trendTone.change}</span>
        </span>
      </div>

      <div className="grid gap-1">
        <span className={mobileLabelClass}>Exchange</span>
        <span className="badge w-fit">{stock.exchange}</span>
      </div>

      <div className="grid gap-2 sm:col-span-2 lg:col-span-1 lg:justify-items-end">
        <span className={mobileLabelClass}>Actions</span>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <button
            type="button"
            className={`btn-icon ${stock.favorite ? "border-amber-200 bg-amber-50 text-amber-700" : ""}`}
            onClick={() => onToggleFavorite(stock)}
            title={stock.favorite ? "Remove Favorite" : "Add to Favorite"}
            disabled={isBusy}
          >
            <FiStar />
          </button>

          <button
            type="button"
            className="btn-icon text-slate-600"
            onClick={() => onView(stock)}
            title="View"
            disabled={isBusy}
          >
            <FiEye />
          </button>
          <button
            type="button"
            className="btn-icon text-slate-600"
            onClick={() => onUpdate(stock)}
            title="Update"
            disabled={isBusy}
          >
            <FiEdit2 />
          </button>
          <button
            type="button"
            className="btn-icon text-rose-500 hover:text-rose-600"
            onClick={() => onDelete(stock)}
            title="Delete"
            disabled={isBusy}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}
