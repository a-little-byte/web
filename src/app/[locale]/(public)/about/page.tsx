import {
  Feature,
  Features,
} from "@/app/[locale]/(public)/about/_components/Features";
import { Button } from "@/components/ui/button";
import { Link, locales } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

const features: Array<Feature> = [
  {
    id: "expertTeam",
    translationKey: "whyChoose.features.expertTeam",
    srcImage:
      "https://images.unsplash.com/photo-1717501219716-b93a67d2f7b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    id: "advancedTechnology",
    translationKey: "whyChoose.features.advancedTechnology",
    srcImage:
      "https://images.unsplash.com/photo-1717501219716-b93a67d2f7b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    id: "support",
    translationKey: "whyChoose.features.support",
    srcImage:
      "https://images.unsplash.com/photo-1717501219716-b93a67d2f7b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    id: "globalCoverage",
    translationKey: "whyChoose.features.globalCoverage",
    srcImage:
      "https://images.unsplash.com/photo-1717501219716-b93a67d2f7b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
];

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

          <Features data={features} />

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
