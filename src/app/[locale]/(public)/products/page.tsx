import { locales } from "@/lib/i18n/routing";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

const ProductsPage = async () => {};

export default ProductsPage;
