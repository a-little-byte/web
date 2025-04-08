import { Section } from "@/app/[locale]/(public)/privacy/_components/Section";
import { locales } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

const sections = [
  "data",
  "cookies",
  "third-party",
  "security",
  "changes",
  "contact",
  "consent",
  "lastUpdated",
] as const;

const PrivacyPage = async () => {
  const t = await getTranslations("privacy");

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
        <div className="prose dark:prose-invert max-w-none flex flex-col gap-4">
          <p>{t("intro")}</p>
          <div className="flex flex-col gap-8">
            {sections.map((section) => (
              <Section key={section} ns={`privacy.${section}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
