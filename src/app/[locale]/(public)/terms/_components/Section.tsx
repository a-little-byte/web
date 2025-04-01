import { getTranslations } from "next-intl/server";

export const Section = async ({
  ns,
  children,
}: {
  ns: string;
  children?: React.ReactNode;
}) => {
  const t = await getTranslations(ns);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{t("title")}</h2>
      <p>{t("content")}</p>
      {children}
    </section>
  );
};
