// components/orders/RootcauseSelect.tsx

"use client";

interface Rootcause {
  id: string;
  label: string;
}

interface RootcauseSelectProps {
  value: string | null;
  rootcauses: Rootcause[];
  onChange: (value: string | null) => void;
  disabled?: boolean;
  required?: boolean;
}

export function RootcauseSelect({
  value,
  rootcauses,
  onChange,
  disabled,
  required = false,
}: RootcauseSelectProps) {
  return (
    <select
      value={value || ""}
      onChange={(e) =>
        onChange(e.target.value === "" ? null : e.target.value)
      }
      disabled={disabled}
      required={required}
      className={`text-xs border rounded-md px-2 py-1.5 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-ink/20 disabled:opacity-50 ${
        required && !value
          ? "border-red-300"
          : "border-border"
      }`}
    >
      <option value="">— Select —</option>
      {rootcauses.map((rc) => (
        <option key={rc.id} value={rc.id}>
          {rc.label}
        </option>
      ))}
    </select>
  );
}
