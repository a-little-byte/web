import { Button } from "@/components/ui/button";
import Typewriter from "@/components/ui/typewriter";
import { Link } from "@/i18n/routing";
import { Globe, Lock, Shield, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

const features = [
  {
    name: "soc",
    icon: Shield,
  },
  {
    name: "edr",
    icon: Zap,
  },
  {
    name: "xdr",
    icon: Lock,
  },
  {
    name: "global",
    icon: Globe,
  },
] as const;

const Home = () => {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col">
      <section className="relative">
        <div className="container flex flex-col items-center py-20 text-center lg:py-32">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {t("hero.title")}{" "}
            <Typewriter
              text={t.raw("hero.typings")}
              speed={70}
              className="text-background"
              waitTime={1500}
              deleteSpeed={40}
              cursorChar={"_"}
            />
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-prose">
            {t("hero.description")}
          </p>
          <div className="mt-10 flex gap-4">
            <Button size="lg" asChild>
              <Link href="/services">{t("hero.exploreServices")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">{t("hero.contactSales")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative p-6 rounded-2xl border bg-card text-card-foreground"
            >
              <div className="absolute top-6 right-6">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-8 text-lg font-semibold">
                {t(`features.${feature.name}.title`)}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {t(`features.${feature.name}.description`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-20">
        <div className="rounded-3xl bg-primary px-6 py-20 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground">
              {t("cta.description")}
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">{t("cta.button")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
