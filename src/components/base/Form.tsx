import { ComponentProps, ReactNode } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

type FormProps<T extends FieldValues> = {
  form: UseFormReturn<T, unknown, T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
} & Omit<ComponentProps<"form">, "onSubmit">;

export const Form = <T extends FieldValues>({
  form,
  children,
  onSubmit,
  ...props
}: FormProps<T>) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormProvider>
  );
};
