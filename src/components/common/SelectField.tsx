import { ErrorMessage, Field } from "formik";
import type { ComponentPropsWithoutRef } from "react";
import { Label } from "../ui/label";
export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

interface SelectFieldProps extends Omit<
  ComponentPropsWithoutRef<"select">,
  "name"
> {
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
}

export default function SelectField({
  name,
  label,
  placeholder,
  options,
  className,
  id,
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? name;
  return (
    <div className="space-y-1">
      <Label htmlFor={fieldId}>{label}</Label>
      <Field
        id={fieldId}
        name={name}
        as="select"
        className={`w-full rounded-md border bg-background px-3 py-2 text-sm  ${className ?? ""}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options?.map((option) => (
          <option
            disabled={option?.disabled}
            key={option.value}
            value={option?.value}
          >
            {option?.label}
          </option>
        ))}
      </Field>
      <ErrorMessage
        name={name}
        component="p"
        className="text-sm text-red-500"
      />
    </div>
  );
}
