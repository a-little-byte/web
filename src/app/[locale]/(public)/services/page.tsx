import { db } from "@/db";
import { getTranslations } from "next-intl/server";
import { Services } from "./_components/Services";

//cuicui.day/marketing-ui/pricing-tables

// const services: Array<Service> = [
//   {
//     id: "soc",
//     icon: Shield,
//     name: t("products.soc.name"),
//     description: t("products.soc.description"),
//     features: t.raw("products.soc.features"),
//     basePrice: 2999,
//     period: "month",
//     priceId: "essential",
//   },
//   {
//     id: "edr",
//     icon: Zap,
//     name: t("products.edr.name"),
//     description: t("products.edr.description"),
//     features: t.raw("products.edr.features"),
//     basePrice: 15,
//     period: "endpoint/month",
//     priceId: "professional",
//   },
//   {
//     id: "xdr",
//     icon: Lock,
//     name: t("products.xdr.name"),
//     description: t("products.xdr.description"),
//     features: t.raw("products.xdr.features"),
//     basePrice: 4999,
//     period: "month",
//     priceId: "enterprise",
//   },
// ] as const;

const ServicesPage = async () => {
  const t = await getTranslations("services");
  const services = await db.selectFrom("services").selectAll().execute();

  return (
    <div className="py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("header.title")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {t("header.description")}
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          <Services services={services} />
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
