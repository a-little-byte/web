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
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface SearchBarProps {
  navigation: NavigationItem[];
}

export const SearchBar = ({ navigation }: SearchBarProps) => {
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
    <>
      <Button
        variant="ghost"
        size="sm"
        className="hidden md:flex"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-8 mr-2" />
        {t("search")}
        <kbd className="ml-2 pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          ⌘K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("searchPlaceholder")} />
        <CommandList>
          <CommandEmpty>{t("searchEmpty")}</CommandEmpty>
          <CommandGroup heading="Navigation">
            {navigation.map((item) => (
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  router.push(item.href);
                }}
                key={item.name}
              >
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
