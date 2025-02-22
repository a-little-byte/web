import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { DangerTab, PasswordTab, ProfileTab } from "./tabs";

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

const SettingsPage = () => {
  const t = useTranslations("dashboard.settings");

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
