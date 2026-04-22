import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function StockListPagination({
  activePage,
  totalPages,
  visiblePages,
  onNext,
  onPrevious,
  onSelectPage,
}) {
  const resolvedTotalPages = totalPages === 0 ? 1 : totalPages;

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-slate-600">
        Page {activePage} of {resolvedTotalPages}
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn-secondary flex-1 sm:flex-none"
          onClick={onPrevious}
          disabled={activePage === 1}
        >
          <FiChevronLeft />
          <span>Previous</span>
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {visiblePages.map((page) => (
            <button
              key={page}
              type="button"
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                page === activePage
                  ? "bg-slate-800 text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
              onClick={() => onSelectPage(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <span className="badge sm:hidden">{activePage}</span>

        <button
          type="button"
          className="btn-secondary flex-1 sm:flex-none"
          onClick={onNext}
          disabled={activePage === totalPages || totalPages === 0}
        >
          <span>Next</span>
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
