"use client";

import { NavigationItem } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Link, useRouter } from "@/lib/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface SearchBarProps {
  navigation: NavigationItem[];
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const SearchBar = ({
  navigation,
  children,
  className,
  as,
}: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("navigation");
  const router = useRouter();
  const Comp = as ?? Button;

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
    <>
      <Comp className={className} onClick={() => setOpen(true)}>
        {children}
      </Comp>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("searchPlaceholder")} />
        <CommandList>
          <CommandEmpty>{t("searchEmpty")}</CommandEmpty>
          <CommandGroup heading="Navigation">
            {navigation.map((item) => (
              <CommandItem
                className="flex items-center gap-2"
                onSelect={() => {
                  setOpen(false);
                  router.push(item.href);
                }}
                key={item.name}
              >
                {item.Icon && <item.Icon className="w-4 h-4" />}
                <Link className="w-full" href={item.href}>
                  {t(item.name)}
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
