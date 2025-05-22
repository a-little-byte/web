import CarouselDemo from "@/components/carousel-demo";
import { Button } from "@/components/ui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import Typewriter from "@/components/ui/typewriter";
import { Link, locales } from "@/lib/i18n/routing";
import { Globe, Lock, Shield, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

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

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Netflix",
  "YouTube",
  "Instagram",
  "Uber",
  "Spotify",
] as const;

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

interface GridItemProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ icon, title, description }: GridItemProps) => (
  <li className="min-h-[14rem] list-none">
    <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
        <div className="relative flex flex-1 flex-col justify-between gap-3">
          <div className="w-fit rounded-lg border border-gray-600 p-2">
            {icon}
          </div>
          <div className="space-y-3">
            <h3 className="mt-8 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </div>
  </li>
);

const Home = async () => {
  const t = await getTranslations("home");

  return (
    <div className="flex flex-col">
      <section className="relative">
        <div className="container flex flex-col items-center py-20 text-center lg:py-32">
          {/* https://ui.aceternity.com/components/text-generate-effect generate text before everything */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {t("hero.title")}{" "}
            <Typewriter
              text={t.raw("hero.typings")}
              className="text-background dark:text-white"
              waitTime={1500}
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

      <section id="companies">
        <div className="py-14">
          <div className="container mx-auto px-4 md:px-8">
            <h3 className="text-center text-sm font-semibold text-gray-500 dark:text-white">
              {t("companies.title")}
            </h3>
            <div className="relative mt-6">
              {/* https://ui.aceternity.com/components/link-preview */}
              <div className="grid grid-cols-2 place-items-center gap-2 md:grid-cols-4 xl:grid-cols-8 xl:gap-4">
                {companies.map((logo, idx) => (
                  <Image
                    key={idx}
                    src={`https://cdn.magicui.design/companies/${logo}.svg`}
                    className="px-2 dark:brightness-0 dark:invert"
                    alt={logo}
                    width={160}
                    height={40}
                  />
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-1/3 bg-gradient-to-r from-white dark:from-black"></div>
              <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/3 bg-gradient-to-l from-white dark:from-black"></div>
            </div>
          </div>
        </div>
      </section>

      {/* https://ui.aceternity.com/components/feature-sections */}
      <section className="container py-20">
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <GridItem
              key={feature.name}
              icon={<feature.icon className="h-6 w-6 text-primary" />}
              title={t(`features.${feature.name}.title`)}
              description={t(`features.${feature.name}.description`)}
            />
          ))}
        </ul>
      </section>

      <section className="container py-20">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-10">
          Services
        </h2>
        <CarouselDemo />
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
