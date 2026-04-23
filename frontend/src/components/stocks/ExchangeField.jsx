import { FiChevronDown, FiLayers } from "react-icons/fi";

export default function ExchangeField({
  exchanges,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-slate-700" htmlFor="exchange">
        Exchange
      </label>

      <div className="relative">
        <FiLayers className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-base text-slate-500" />
        <select
          id="exchange"
          name="exchange"
          className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-14 text-sm font-medium text-slate-800 shadow-sm transition duration-200 hover:border-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-900/5"
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          {exchanges.map((exchange) => (
            <option key={exchange.id} value={exchange.code}>
              {exchange.code}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
          <FiChevronDown className="text-sm" />
        </div>
      </div>
    </div>
  );
}
