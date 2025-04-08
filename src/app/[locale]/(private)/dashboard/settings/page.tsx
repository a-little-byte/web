import {
  DangerTab,
  PasswordTab,
  ProfileTab,
} from "@/app/[locale]/(private)/dashboard/settings/tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { locales } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";

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

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

const SettingsPage = async () => {
  const t = await getTranslations("dashboard.settings");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {t(`tabs.${tab.value}`)}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SettingsPage;
