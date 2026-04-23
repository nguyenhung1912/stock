import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiCheckSquare,
  FiDollarSign,
  FiLayers,
  FiPlus,
  FiTag,
} from "react-icons/fi";
import { toast } from "react-toastify";
import ExchangeField from "@/components/stocks/ExchangeField";
import InputField from "@/components/ui/InputField";
import { stockService } from "@/services/stockService";
import {
  getCreateStockErrors,
  getCreateStockResetState,
  INITIAL_CREATE_STOCK_FORM,
} from "@/utils/createStockForm";

export default function CreateStockPage() {
  const [exchanges, setExchanges] = useState([]);
  const [formData, setFormData] = useState(INITIAL_CREATE_STOCK_FORM);
  const [touched, setTouched] = useState({});
  const [isLoadingExchanges, setIsLoadingExchanges] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errors = getCreateStockErrors(formData);

  useEffect(() => {
    let isMounted = true;

    async function loadExchanges() {
      try {
        const data = await stockService.getExchanges();

        if (!isMounted) {
          return;
        }

        setExchanges(data);
        setFormData((prev) => ({
          ...prev,
          exchange: data.some((exchange) => exchange.code === prev.exchange)
            ? prev.exchange
            : (data[0]?.code ?? prev.exchange),
        }));
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Error when loading the exchange list");
      } finally {
        if (isMounted) {
          setIsLoadingExchanges(false);
        }
      }
    }

    loadExchanges();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    let nextValue = value;

    if (type === "checkbox") {
      nextValue = checked;
    }

    if (name === "price") {
      nextValue = value === "" ? "" : Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setTouched({ name: true, code: true, price: true, confirm: true });

    const hasErrors = Object.values(errors).some((error) => error !== null);
    if (hasErrors) return;

    const newStock = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      price: formData.price,
      previousPrice: formData.price,
      favorite: false,
      exchange: formData.exchange,
    };

    try {
      setIsSubmitting(true);
      const created = await stockService.create(newStock);
      toast.success(`Create successful: ${created.code}`);

      setFormData(getCreateStockResetState(exchanges[0]?.code));
      setTouched({});
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Create stock failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInvalid = (field) => touched[field] && errors[field];

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-4">
      <div className="page-header">
        <span className="page-eyebrow">Stocks</span>
        <h1 className="page-title">Create stock</h1>
        <p className="page-subtitle">
          Add a new stock record with name, code, price and exchange.
        </p>
      </div>

      <section className="surface-card p-5 sm:p-6">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="Name"
              icon={FiLayers}
              type="text"
              name="name"
              className="md:col-span-2"
              placeholder="e.g. Apple Inc."
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur("name")}
              error={isInvalid("name") ? errors.name : null}
              disabled={isSubmitting}
            />

            <InputField
              label="Code"
              icon={FiTag}
              type="text"
              name="code"
              placeholder="e.g. AAPL"
              value={formData.code}
              onChange={handleChange}
              onBlur={() => handleBlur("code")}
              error={isInvalid("code") ? errors.code : null}
              disabled={isSubmitting}
            />

            <InputField
              label="Price"
              icon={FiDollarSign}
              type="number"
              name="price"
              min="0"
              step="any"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              onBlur={() => handleBlur("price")}
              error={isInvalid("price") ? errors.price : null}
              disabled={isSubmitting}
            />
          </div>

          <ExchangeField
            exchanges={exchanges}
            value={formData.exchange}
            onChange={handleChange}
            disabled={isLoadingExchanges || isSubmitting}
          />

          <label
            htmlFor="confirmCheck"
            className={`flex items-start gap-3 rounded-xl border p-3 ${
              isInvalid("confirm")
                ? "border-rose-200 bg-rose-50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <input
              type="checkbox"
              name="confirm"
              id="confirmCheck"
              checked={formData.confirm}
              onChange={handleChange}
              disabled={isSubmitting}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/10"
            />
            <span className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiCheckSquare className="text-slate-500" />
                Confirm information
              </span>
              <span className="text-sm text-slate-600">
                I confirm that the data above is correct.
              </span>
            </span>
          </label>

          {isInvalid("confirm") ? (
            <div className="inline-flex items-center gap-2 text-xs text-rose-600">
              <FiAlertCircle />
              <span>{errors.confirm}</span>
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="submit"
              className={`btn-primary w-full sm:w-auto ${isSubmitting ? "pointer-events-none opacity-70" : ""}`}
              disabled={isLoadingExchanges || isSubmitting}
            >
              <FiPlus />
              <span>
                {isSubmitting
                  ? "Creating..."
                  : isLoadingExchanges
                    ? "Loading..."
                    : "Create stock"}
              </span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
