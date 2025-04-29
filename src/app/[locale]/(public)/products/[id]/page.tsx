import { ProductView } from "@/app/[locale]/(public)/products/[id]/_components/ProductView";
import { Link, locales } from "@/lib/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

const ProductDetailPage = async () => {
  const t = await getTranslations("products");

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("backToProducts")}
        </Link>
      </div>

      <ProductView />
    </div>
  );
};

export default ProductDetailPage;
