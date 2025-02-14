"use client";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/routing";
import { Menu, Search, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./language-switcher";
import { ShoppingCart } from "./shopping-cart";

const navigation = [
  { name: "solutions", href: "/solutions" },
  { name: "pricing", href: "/pricing" },
  { name: "about", href: "/about" },
  { name: "contact", href: "/contact" },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("navigation");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center">
        <div className="flex lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium uppercase tracking-wide"
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
            <ShieldCheck className="h-8 w-8 text-brand-blue" />
            <span className="font-black text-xl uppercase tracking-wide">
              Cyna
            </span>
          </Link>

          <div className="hidden lg:flex lg:gap-x-8 lg:ml-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-bold uppercase tracking-wide transition-colors hover:text-primary"
              >
                {t(item.name)}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center ml-auto gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex"
            onClick={() => setOpen(true)}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
            <kbd className="ml-2 pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              ⌘K
            </kbd>
          </Button>

          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {navigation.map((item) => (
                  <CommandItem>
                    <Link href={item.href}>{t(item.name)}</Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </CommandDialog>

          <ShoppingCart />
          <LanguageSwitcher />

          <div className="hidden sm:flex sm:items-center sm:gap-2">
            <SignOrDashboard />
          </div>
        </div>
      </nav>
    </header>
  );
}

const SignOrDashboard = () => {
  const t = useTranslations("navigation");

  return (
    <>
      <Button variant="ghost" asChild className="font-bold">
        <Link href="/login">{t("signIn")}</Link>
      </Button>
      <Button asChild>
        <Link href="/register">{t("signUp")}</Link>
      </Button>
    </>
  );
};
