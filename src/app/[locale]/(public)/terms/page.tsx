import { Section } from "@/app/[locale]/(public)/terms/_components/Section";
import { locales } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

const Terms = async () => {
  const t = await getTranslations("terms");

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">{t("lastUpdated")}</p>
          <div className="flex flex-col gap-8">
            <Section ns="terms.definitions" />

            <Section ns="terms.presentation" />

            <Section ns="terms.conditions" />

            <Section ns="terms.services" />

            <Section ns="terms.technical" />

            <Section ns="terms.ip" />

            <Section ns="terms.liability" />

            <Section ns="terms.data">
              <Section ns="terms.data.responsible" className="mt-4 ml-4" />
              <Section ns="terms.data.purpose" className="mt-4 ml-4" />
              <Section ns="terms.data.rights" className="mt-4 ml-4" />
              <Section ns="terms.data.noncommunication" className="mt-4 ml-4" />
            </Section>

            <Section ns="terms.incident" />

            <Section ns="terms.cookies">
              <Section ns="terms.cookies.definition" className="mt-4 ml-4" />
              <Section ns="terms.cookies.beacons" className="mt-4 ml-4" />
            </Section>

            <Section ns="terms.jurisdiction" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
