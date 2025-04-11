import { Tabs } from "@/app/[locale]/(private)/dashboard/settings/tabs";
import { locales } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

const SettingsPage = async () => {
  const t = await getTranslations("dashboard.settings");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Tabs />
    </div>
  );
};

export default SettingsPage;
