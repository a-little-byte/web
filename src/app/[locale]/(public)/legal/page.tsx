import { Section } from "@/app/[locale]/(public)/legal/_components/Section";
import { locales } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

const t = await getTranslations("legal");

const sections = [
  {
    ns: "legal.copyright",
  },
  {
    ns: "legal.trademark",
  },
  {
    ns: "legal.disclaimer",
    children: <p className="mt-4">{t("disclaimer.additional")}</p>,
  },
  {
    ns: "legal.liability",
    children: <p className="mt-4">{t("liability.additional")}</p>,
  },
  {
    ns: "legal.export",
    children: <p className="mt-4">{t("export.additional")}</p>,
  },
  {
    ns: "legal.governing",
  },
  {
    ns: "legal.contact",
    children: (
      <div className="mt-4">
        <p>{t("contact.company")}</p>
        <p>{t("contact.address.line1")}</p>
        <p>{t("contact.address.line2")}</p>
        <p>{t("contact.address.line3")}</p>
        <p>{t("contact.address.line4")}</p>
        <p className="mt-2">{t("contact.email")}</p>
        <p>{t("contact.phone")}</p>
      </div>
    ),
  },
  {
    ns: "legal.changes",
    children: <p className="mt-4">{t("changes.additional")}</p>,
  },
  {
    ns: "legal.lastUpdated",
  },
] as const;
const Legal = async () => {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

        <div className="prose dark:prose-invert max-w-none space-y-12">
          {sections.map((section) => (
            <Section key={section.ns} {...section} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Legal;
