import { FiRefreshCw, FiSearch } from "react-icons/fi";

export default function StockListToolbar({
  searchText,
  totalItems,
  onRefresh,
  onSearchChange,
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="field-shell w-full sm:max-w-sm">
        <FiSearch className="field-icon" />
        <input
          type="text"
          className="field-input"
          placeholder="Search by name or code"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="badge">{totalItems} items</span>
        <button type="button" className="btn-secondary" onClick={onRefresh}>
          <FiRefreshCw />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}
