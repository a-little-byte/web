import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/style";
import { InputHTMLAttributes } from "react";
import { Control, FieldValues, Path, useFormContext } from "react-hook-form";

interface InputFormProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  control: Control<T>;
  label: string;
  name: Path<T>;
}
export const InputField = <T extends FieldValues>({
  control,
  name,
  label,
  type,
  placeholder,
  className,
  disabled,
  ...props
}: InputFormProps<T>) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className={cn(className, "placeholder:text-muted-foreground")}
              disabled={isSubmitting || disabled}
              {...props}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
