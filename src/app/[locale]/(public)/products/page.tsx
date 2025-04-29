import { ProductList } from "@/app/[locale]/(public)/products/_components/ProductList";
import { locales } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

const ProductsPage = async () => {
  const t = await getTranslations("products");

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>
      <ProductList />
    </div>
  );
};

export default ProductsPage;
