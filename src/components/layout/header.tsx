import { SearchBar } from "@/components/layout/SearchBar";
import { SheetNavigation } from "@/components/layout/SheetNavigation";
import { ShoppingCart } from "@/components/shopping-cart";
import { Button } from "@/components/ui/button";
import ScrambleHover from "@/components/ui/scramble";
import { Link } from "@/i18n/routing";
import { createServerClient } from "@/lib/supabase/server";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { cookies } from "next/headers";

export type NavigationItem = { name: string; href: string };

const navigation: NavigationItem[] = [
  { name: "services", href: "/services" },
  { name: "about", href: "/about" },
  { name: "contact", href: "/contact" },
];

export const Header = () => {
  const t = useTranslations("navigation");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center">
        <div className="flex lg:hidden">
          <SheetNavigation navigation={navigation} />
        </div>

        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <ShieldCheck className="h-8 w-8 text-foreground" />
            <span className="font-black text-xl uppercase tracking-wide">
              <ScrambleHover
                text="Cyna"
                scrambleSpeed={150}
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
                className="text-sm font-medium tracking-wide transition-colors hover:text-primary"
              >
                {t(item.name)}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center ml-auto gap-4">
          <SearchBar navigation={navigation} />

          <ShoppingCart />

          <div className="hidden sm:flex sm:items-center sm:gap-2">
            <SignOrDashboard />
          </div>
        </div>
      </nav>
    </header>
  );
};

const SignOrDashboard = async () => {
  const t = useTranslations("navigation");

  const cookie = cookies();
  const supabase = createServerClient();
  const { data } = await supabase.auth.getSession();

  if (cookie.get("auth-token") && data?.session?.user) {
    return (
      <Button variant="ghost" asChild className="font-bold">
        <Link href="/dashboard">{t("dashboard")}</Link>
      </Button>
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
