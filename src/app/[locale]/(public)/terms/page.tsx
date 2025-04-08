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
            <Section ns="terms.intro">
              <p className="mt-4">{t("intro.agreement")}</p>
            </Section>

            <Section ns="terms.service">
              <ul className="list-disc pl-6 mt-2">
                {Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <li key={i}>{t(`service.items.${i}`)}</li>
                  ))}
              </ul>
            </Section>

            <Section ns="terms.accounts">
              <p className="mt-4">{t("accounts.responsibility")}</p>
            </Section>

            <Section ns="terms.subscription">
              <p className="mt-4">{t("subscription.payment")}</p>
            </Section>

            <Section ns="terms.sla">
              <p className="mt-4">{t("sla.disruption")}</p>
            </Section>

            <Section ns="terms.data">
              <ul className="list-disc pl-6 mt-2">
                {Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <li key={i}>{t(`data.measures.${i}`)}</li>
                  ))}
              </ul>
            </Section>

            <Section ns="terms.ip" />

            <Section ns="terms.termination" />

            <Section ns="terms.liability" />

            <Section ns="terms.changes" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
