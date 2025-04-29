"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@/hooks/useQuery";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "@/lib/i18n/routing";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export const ProductView = () => {
  const t = useTranslations("products");
  const locale = useLocale();
  const param = useParams<{ id: string }>();
  const router = useRouter();
  const {
    data: product,
    isLoading,
    error,
  } = useQuery(apiClient.products[":id"], {
    param,
  });

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center">
          <p className="text-lg">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-red-500">
            {error?.message || "Product not found"}
          </p>
          <Button onClick={() => router.push("/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("backToProducts")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex items-center justify-center bg-muted rounded-lg p-10">
          <div className="flex h-48 w-48 items-center justify-center rounded-md bg-primary/10 text-primary">
            <span className="text-4xl font-bold">{product.name.charAt(0)}</span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-3xl font-bold text-primary mt-4">
            {formatCurrency(locale, product.price)}
          </p>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("category")}</span>
              <span className="font-medium">{product.categoryName}</span>
            </div>

            <Button size="lg" className="w-full mt-6">
              {t("addToCart")}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">{t("details")}</h2>
        <Card>
          <CardHeader>
            <CardTitle>{t("description")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("placeholder")}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
