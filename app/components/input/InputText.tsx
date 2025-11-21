import { cn, formatRupiah, parseNumber } from "@/lib/utils";
import { ChangeEvent, ReactNode } from "react";

// ********** Local Interface **********
interface InputTextProps {
  type?: "text" | "number" | "password";
  value?: string | number;
  onChange?: (value: string | number) => void;
  onBlur?: () => void;
  placeholder?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
  className?: string;
  errorMessage?: string;
  label?: string;
  name?: string;
  required?: boolean;
  currency?: boolean;
  containerSpaceYClass?: string;
}

// ********** Main Coimponent **********
const InputText: React.FC<InputTextProps> = ({
  type = "text",
  value = "",
  onChange,
  placeholder,
  prefix,
  suffix,
  disabled,
  className,
  errorMessage,
  label,
  required,
  name,
  currency,
  onBlur,
  containerSpaceYClass = "space-y-1.5",
}) => {

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = currency ? parseNumber(e.target.value) : e.target.value;
    onChange?.(raw);
  };

  return (
    <div className={cn("relative", containerSpaceYClass)}>
      {label && (
        <label className="text-xs text-gray-600">
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <div className={cn("relative border rounded-md flex", errorMessage && "border-red-600!", className)}>
        {prefix && <div className="ml-3 flex items-center">{prefix}</div>}

        <input
          type={type}
          name={name}
          onBlur={onBlur}
          value={currency ? formatRupiah(value) : value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full rounded py-2 px-3 text-sm bg-transparent focus:outline-none",
            prefix && "pl-8",
            suffix && "pr-8",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />

        {suffix && <div className="flex items-center mr-3">{suffix}</div>}
      </div>

      {errorMessage && <p className="text-xs text-red-600 ml-1">{errorMessage}</p>}
    </div>
  );
};

export default InputText;
