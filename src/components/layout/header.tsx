import { SearchBar } from "@/components/layout/SearchBar";
import { ShoppingCart } from "@/components/shopping-cart";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import { Menu, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export type NavigationItem = { name: string; href: string };

const navigation: NavigationItem[] = [
  { name: "solutions", href: "/solutions" },
  { name: "pricing", href: "/pricing" },
  { name: "about", href: "/about" },
  { name: "contact", href: "/contact" },
];

export const Header = () => {
  const t = useTranslations("navigation");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center">
        <div className="flex lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t("toggleMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>{t("menu")}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-foreground text-lg font-medium uppercase tracking-wide"
                  >
                    {t(item.name)}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <ShieldCheck className="h-8 w-8 text-foreground" />
            <span className="font-black text-xl uppercase tracking-wide">
              Cyna
            </span>
          </Link>

          <div className="hidden lg:flex lg:gap-x-8 lg:ml-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary"
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

  const { data } = await supabase.auth.getSession();

  if (data?.session?.user) {
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
