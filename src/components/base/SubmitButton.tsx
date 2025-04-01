import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useFormState } from "react-hook-form";

export const SubmitButton = ({ ns }: { ns: string }) => {
  const form = useFormState();
  const t = useTranslations(ns);

  return (
    <Button type="submit" disabled={form.isSubmitting}>
      {t(`form.submit.${form.isSubmitting ? "sending" : "default"}`)}
    </Button>
  );
};
