import { ErrorMessage, Field, useFormikContext } from "formik";
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
  className,
  ...props
}: InputFieldProps<T>) {
  const Component = as ?? Input;
  const fieldId = id ?? name;

  const { errors, touched, submitCount } =
    useFormikContext<Record<string, unknown>>();

  const hasError =
    Boolean(touched[name] || submitCount > 0) && Boolean(errors[name]);
  return (
    <div className="space-y-1">
      <Label htmlFor={fieldId}>{label}</Label>

      <Field
        as={Component}
        id={fieldId}
        className={[
          className,
          hasError
            ? "!border-destructive focus-visible:!border-destructive focus-visible:!ring-destructive/20"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        name={name}
        {...props}
      />

      <ErrorMessage
        name={name}
        component="p"
        className="text-sm text-red-500"
      />
    </div>
  );
}

export default InputField;
