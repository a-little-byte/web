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
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@/hooks/useQuery";
import { apiClient } from "@/lib/apiClient";
import { Link } from "@/lib/i18n/routing";
import { formatCurrency } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

interface GroupedProducts {
  [categoryName: string]: Array<{
    id: string;
    name: string;
    price: number;
    created_at: string;
    updated_at: string;
  }>;
}

const ProductCardSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-3">
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-1/3" />
    </CardContent>
    <CardFooter className="bg-muted/50 pt-3 flex flex-col gap-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

const CategorySkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-6 w-20" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const ProductList = () => {
  const { data: products, isLoading } = useQuery(apiClient.products);
  const t = useTranslations("products");
  const locale = useLocale();
  console.log(products);
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

  if (isLoading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <CategorySkeleton key={i} />
        ))}
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
            )
          )}
        </div>
      )}
    </>
  );
};
