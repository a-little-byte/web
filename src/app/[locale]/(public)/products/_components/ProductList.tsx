"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@/hooks/useQuery";
import { apiClient } from "@/lib/apiClient";
import { Link } from "@/lib/i18n/routing";
import { formatCurrency } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

interface GroupedProducts {
  [categoryName: string]: Array<{
    id: string;
    name: string;
    price: number;
    created_at: string;
    updated_at: string;
  }>;
}

export const ProductList = () => {
  const { data: products, isLoading } = useQuery(apiClient.products);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const t = useTranslations("products");
  const locale = useLocale();
  const groupedProducts: GroupedProducts = useMemo(() => {
    if (!products) return {};

    return products.reduce((acc: GroupedProducts, product) => {
      const categoryName = product.categoryName;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    }, {});
  }, [JSON.stringify(products)]);

  const handleToggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName],
    );
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center">
          <p className="text-lg">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {Object.keys(groupedProducts).length === 0 ? (
        <p className="text-center text-muted-foreground">{t("noProducts")}</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedProducts).map(
            ([categoryName, categoryProducts]) => (
              <div key={categoryName} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">{categoryName}</h2>
                  <Badge variant="outline" className="px-3 py-1">
                    {t("product", { count: categoryProducts.length })}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl">
                          {product.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-primary">
                          {formatCurrency(locale, product.price)}
                        </p>
                      </CardContent>
                      <CardFooter className="bg-muted/50 pt-3 flex flex-col gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="w-full"
                        >
                          <Button className="w-full">{t("viewDetails")}</Button>
                        </Link>
                        <Button variant="outline" className="w-full">
                          {t("addToCart")}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </>
  );
};
