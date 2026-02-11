interface FormCheckboxStatusProps {
  title: string;
  value?: "true" | "false";
  disabled?: boolean;
  onChange?: (value: "true" | "false") => void;
  name?: string;
}

export default function FormCheckboxStatus({
  title,
  value = "false",
  disabled = false,
  onChange,
  name,
}: FormCheckboxStatusProps) {
  const toggleValue = value === "true" ? "false" : "true";

  return (
    <div>
      <label className="block font-poppins-medium text-sm text-gray-700 mb-2">
        {title}
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          name={name}
          disabled={disabled}
          onClick={() => !disabled && onChange?.(toggleValue)}
          className={`
            relative w-14 h-7 rounded-full transition-all duration-200
            ${value === "true" ? "bg-primary" : "bg-gray-300"}
            ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <span
            className={`
              absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full
              transition-all duration-200
              ${value === "true" ? "translate-x-7" : "translate-x-0"}
            `}
          />
        </button>

        <span
          className={`
            text-sm font-poppins-medium
            ${value === "true" ? "text-primary" : "text-gray-500"}
          `}
        >
          {value === "true" ? "Aktif" : "Tidak Aktif"}
        </span>

        <input type="hidden" name={name} value={value} />
      </div>
    </div>
  );
}
