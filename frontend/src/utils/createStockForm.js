export const INITIAL_CREATE_STOCK_FORM = {
  name: "",
  code: "",
  price: "",
  exchange: "NASDAQ",
  confirm: false,
};

export const getCreateStockErrors = (formData) => ({
  name:
    formData.name.trim().length < 2 ? "Name is required (min 2 chars)" : null,
  code: formData.code.trim().length < 2 ? "Code is required" : null,
  price:
    formData.price === ""
      ? "Price is required"
      : formData.price < 0
        ? "Price must be >= 0"
        : null,
  confirm: !formData.confirm ? "You must confirm the information" : null,
});

export const getCreateStockResetState = (exchangeCode = "NASDAQ") => ({
  ...INITIAL_CREATE_STOCK_FORM,
  exchange: exchangeCode,
});
