export default function InputField({
  id,
  label,
  icon: Icon,
  error,
  inputProps,
  className = "",
  shellClassName = "",
  inputClassName = "",
  labelClassName = "text-sm font-medium text-slate-700",
  errorClassName = "text-xs text-rose-600",
  ...props
}) {
  const wrapperClassName = ["grid gap-2", className].filter(Boolean).join(" ");
  const resolvedShellClassName = [
    "field-shell",
    error ? "field-shell-invalid" : "",
    shellClassName,
  ]
    .filter(Boolean)
    .join(" ");
  const resolvedInputClassName = ["field-input", inputClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName}>
      {label ? (
        <label className={labelClassName} htmlFor={id}>
          {label}
        </label>
      ) : null}

      <div className={resolvedShellClassName}>
        {Icon ? <Icon className="field-icon" /> : null}
        <input
          id={id}
          className={resolvedInputClassName}
          {...inputProps}
          {...props}
        />
      </div>

      {error ? <div className={errorClassName}>{error}</div> : null}
    </div>
  );
}
