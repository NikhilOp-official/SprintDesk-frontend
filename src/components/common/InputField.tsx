import { ErrorMessage, Field } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ComponentProps, ElementType } from "react";

type InputFieldProps<T extends ElementType> = {
  label: string;
  name: string;
  as?: T;
} & Omit<ComponentProps<T>, "name" | "as">;

function InputField<T extends ElementType = typeof Input>({
  name,
  label,
  as,
  id,
  ...props
}: InputFieldProps<T>) {
  const Component = as ?? Input;
  const fieldId = id ?? name;
  return (
    <div className="space-y-1">
      <Label htmlFor={fieldId}>{label}</Label>

      <Field as={Component} id={fieldId} name={name} {...props} />

      <ErrorMessage
        name={name}
        component="p"
        className="text-sm text-red-500"
      />
    </div>
  );
}

export default InputField;
