import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { TextareaHTMLAttributes } from "react";
import { Control, FieldValues, Path, useFormContext } from "react-hook-form";

interface TextareaFormProps<T extends FieldValues>
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  control: Control<T>;
  label: string;
  name: Path<T>;
}

export const TextareaField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  disabled,
  ...props
}: TextareaFormProps<T>) => {
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
            <Textarea
              {...field}
              placeholder={placeholder}
              className={className}
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
