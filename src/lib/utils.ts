import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatCurrency = (lang: string, amount: number): string =>
  new Intl.NumberFormat(lang, {
    style: "currency",
    currency: "USD",
  }).format(amount);
