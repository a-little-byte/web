import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";

const features = [
  {
    id: "expertTeam",
    translationKey: "whyChoose.features.expertTeam",
  },
  {
    id: "advancedTechnology",
    translationKey: "whyChoose.features.advancedTechnology",
  },
  {
    id: "support",
    translationKey: "whyChoose.features.support",
  },
  {
    id: "globalCoverage",
    translationKey: "whyChoose.features.globalCoverage",
  },
] as const;

const About = async () => {
  const t = await getTranslations("about");

  return (
    <div className="py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {t("introduction")}
          </p>

          <div className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">
              {t("mission.title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("mission.description")}
            </p>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">
              {t("whyChoose.title")}
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="relative p-6 rounded-2xl border bg-card"
                >
                  <h3 className="text-lg font-semibold">
                    {t(`${feature.translationKey}.title`)}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {t(`${feature.translationKey}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" asChild>
              <Link href="/contact">{t("cta")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
