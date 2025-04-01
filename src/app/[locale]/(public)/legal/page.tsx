import { Section } from "@/app/[locale]/(public)/legal/_components/Section";
import { locales } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

const Legal = async () => {
  const t = await getTranslations("legal");

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

        <div className="prose dark:prose-invert max-w-none space-y-12">
          <Section ns="legal.copyright" />

          <Section ns="legal.trademark" />

          <Section ns="legal.disclaimer">
            <p className="mt-4">{t("disclaimer.additional")}</p>
          </Section>

          <Section ns="legal.liability">
            <p className="mt-4">{t("liability.additional")}</p>
          </Section>

          <Section ns="legal.export">
            <p className="mt-4">{t("export.additional")}</p>
          </Section>

          <Section ns="legal.governing" />

          <Section ns="legal.contact">
            <div className="mt-4">
              <p>{t("contact.company")}</p>
              <p>{t("contact.address.line1")}</p>
              <p>{t("contact.address.line2")}</p>
              <p>{t("contact.address.line3")}</p>
              <p>{t("contact.address.line4")}</p>
              <p className="mt-2">{t("contact.email")}</p>
              <p>{t("contact.phone")}</p>
            </div>
          </Section>

          <Section ns="legal.changes">
            <p className="mt-4">{t("changes.additional")}</p>
          </Section>

          <Section ns="legal.lastUpdated" />
        </div>
      </div>
    </div>
  );
};

export default Legal;
