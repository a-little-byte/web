"use client";

import { DangerTab } from "@/app/[locale]/(private)/dashboard/settings/_tabs/DangerTab";
import { PasswordTab } from "@/app/[locale]/(private)/dashboard/settings/_tabs/PasswordTab";
import { ProfileTab } from "@/app/[locale]/(private)/dashboard/settings/_tabs/ProfileTab";
import {
  Tabs as TabsBase,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useCallback } from "react";

const tabs = [
  {
    value: "profile",
    component: <ProfileTab />,
  },
  {
    value: "password",
    component: <PasswordTab />,
  },
  {
    value: "danger",
    component: <DangerTab />,
  },
] as const;

export const Tabs = () => {
  const t = useTranslations("dashboard.settings.tabs");
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringLiteral(tabs.map((tab) => tab.value)).withDefault(
      tabs[0].value
    )
  );

  const handleTabChange = useCallback((value: string) => {
    setTab(value as (typeof tabs)[number]["value"]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TabsBase
      defaultValue={tab}
      className="space-y-4"
      onValueChange={handleTabChange}
      value={tab}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {t(tab.value)}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.component}
        </TabsContent>
      ))}
    </TabsBase>
  );
};
