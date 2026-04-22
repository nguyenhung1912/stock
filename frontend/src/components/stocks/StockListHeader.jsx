import { FiPlus } from "react-icons/fi";

export default function StockListHeader({
  isFavoritePage,
  pageMeta,
  onCreateStock,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="page-header">
        <span className="page-eyebrow">Stocks</span>
        <h1 className="page-title">{pageMeta.title}</h1>
        <p className="page-subtitle">{pageMeta.subtitle}</p>
      </div>

      {!isFavoritePage ? (
        <button
          type="button"
          className="btn-primary w-full sm:w-auto"
          onClick={onCreateStock}
        >
          <FiPlus />
          <span>New stock</span>
        </button>
      ) : null}
    </div>
  );
}
