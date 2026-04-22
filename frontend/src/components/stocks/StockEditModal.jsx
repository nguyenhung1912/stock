import { FiX } from "react-icons/fi";
import InputField from "@/components/ui/InputField";

export default function StockEditModal({
  stock,
  onClose,
  onFieldChange,
  onSave,
}) {
  if (!stock) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/20 px-4 backdrop-blur-[1px]">
      <div className="surface-card w-full max-w-lg p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Update {stock.code?.toUpperCase()}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Edit the stock name or price.
            </p>
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </div>

        <div className="grid gap-4">
          <InputField
            id="stock-name"
            label="Name"
            type="text"
            value={stock.name}
            onChange={(event) => onFieldChange("name", event.target.value)}
          />

          <InputField
            id="stock-price"
            label="Price"
            type="number"
            value={stock.price}
            onChange={(event) => onFieldChange("price", Number(event.target.value))}
          />
        </div>

        <div className="mt-6 flex gap-2 sm:justify-end">
          <button
            type="button"
            className="btn-secondary flex-1 sm:flex-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary flex-1 sm:flex-none"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
