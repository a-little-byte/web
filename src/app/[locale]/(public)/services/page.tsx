import { Services } from "@/app/[locale]/(public)/services/_components/Services";
import { db } from "@/db";
import { getTranslations } from "next-intl/server";

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
