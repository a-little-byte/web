"use client";

import { NavigationItem } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/routing";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface SheetNavigationProps {
  navigation: NavigationItem[];
}

export const SheetNavigation = ({ navigation }: SheetNavigationProps) => {
  const [sheet, setSheet] = useState(false);
  const t = useTranslations("navigation");

  return (
    <Sheet open={sheet} onOpenChange={setSheet}>
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
              onClick={() => setSheet(false)}
            >
              {t(item.name)}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
