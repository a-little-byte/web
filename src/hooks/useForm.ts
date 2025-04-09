import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldValues,
  useForm as useFormHook,
  UseFormProps,
} from "react-hook-form";
import { z } from "zod";

export const useForm = <T extends FieldValues>(
  validator: z.ZodSchema<T>,
  options?: Exclude<UseFormProps<z.input<typeof validator>>, "resolver">,
) =>
  useFormHook<z.input<typeof validator>, unknown, z.output<typeof validator>>({
    resolver: zodResolver(validator),
    ...options,
  });
