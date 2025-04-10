import { SearchBar } from "@/components/layout/SearchBar";
import { SheetNavigation } from "@/components/layout/SheetNavigation";
import { ShoppingCart } from "@/components/layout/shopping-cart";
import { Button } from "@/components/ui/button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import ScrambleHover from "@/components/ui/scramble";
import { Link } from "@/lib/i18n/routing";
import { ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

export type NavigationItem = { name: string; href: string };

const navigation: NavigationItem[] = [
  { name: "services", href: "/services" },
  { name: "about", href: "/about" },
  { name: "contact", href: "/contact" },
];

const authNavigation: NavigationItem[] = [
  {
    name: "dashboard",
    href: "/dashboard",
  },
  {
    name: "subscriptions",
    href: "/dashboard/subscriptions",
  },
  {
    name: "settings",
    href: "/dashboard/settings",
  },
];

export const Header = async () => {
  const t = await getTranslations("navigation");
  const cookie = await cookies();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center">
        <div className="flex lg:hidden">
          <SheetNavigation navigation={navigation} />
        </div>

        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <ShieldCheck className="h-8 w-8 text-foreground" />
            <span className="font-black text-2xl uppercase tracking-wide">
              <ScrambleHover
                text="Cyna"
                scrambleSpeed={90}
                sequential={true}
                revealDirection="start"
                useOriginalCharsOnly={false}
                className="font-azeretMono"
              />
            </span>
          </Link>

          <div className="hidden lg:flex lg:gap-x-8 lg:ml-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-medium tracking-wide transition-colors hover:text-primary"
              >
                {t(item.name)}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center ml-auto gap-4">
          <SearchBar
            navigation={
              cookie.get("auth-token")
                ? [...navigation, ...authNavigation]
                : [
                    ...navigation,
                    { name: "privacy", href: "/privacy" },
                    { name: "terms", href: "/terms" },
                    { name: "legal", href: "/legal" },
                    { name: "home", href: "/" },
                  ]
            }
          />

          {cookie.get("auth-token") && <ShoppingCart />}

          <div className="hidden sm:flex sm:items-center sm:gap-2">
            <SignOrDashboard />
          </div>
        </div>
      </nav>
    </header>
  );
};

const SignOrDashboard = async () => {
  const t = await getTranslations("navigation");
  const cookie = await cookies();

  if (cookie.get("auth-token")) {
    return (
      <InteractiveHoverButton as={Link} href="/dashboard" className="font-bold">
        {t("dashboard")}
      </InteractiveHoverButton>
    );
  }

  return (
    <>
      <Button variant="ghost" asChild className="font-bold">
        <Link href="/auth/login">{t("signIn")}</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/register">{t("signUp")}</Link>
      </Button>
    </>
  );
};
