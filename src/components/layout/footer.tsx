import { CynaIcon } from "@/components/icons/Cyna";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Link } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";

const navigation: Record<string, { id: string; href: string }[]> = {
  solutions: [
    { id: "soc", href: "/services" },
    { id: "edr", href: "/services" },
    { id: "xdr", href: "/services" },
  ],
  company: [
    { id: "about", href: "/about" },
    { id: "blog", href: "#" },
    { id: "contact", href: "/contact" },
  ],
  legal: [
    { id: "terms", href: "/terms" },
    { id: "privacy", href: "/privacy" },
    { id: "legalNotices", href: "/legal" },
  ],
  social: [
    { id: "twitter", href: "#" },
    { id: "linkedin", href: "#" },
    { id: "facebook", href: "#" },
    { id: "instagram", href: "#" },
  ],
} as const;

export const Footer = async () => {
  const t = await getTranslations("footer");

  return (
    <footer className="bg-background" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <CynaIcon width={28} height={28} />
              <span className="font-bold text-xl">Cyna</span>
            </Link>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
          <div className="mt-16 flex flex-col sm:flex-row justify-between gap-8 xl:col-span-2 xl:mt-0">
            {Object.entries(navigation).map(([key, items]) => (
              <div key={key}>
                <h3 className="text-sm font-semibold">{t(`${key}.title`)}</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {t(`${key}.${item.id}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t pt-8 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Cyna. {t("allRightsReserved")}
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
};
