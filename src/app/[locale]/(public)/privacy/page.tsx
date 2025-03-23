import { getTranslations } from "next-intl/server";

const PrivacyPage = async () => {
  const t = await getTranslations("privacy");

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
        <div className="prose dark:prose-invert max-w-none flex flex-col gap-4">
          <p>{t("intro")}</p>
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("data.title")}</h2>
              <p>{t("data.content")}</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("cookies.title")}
              </h2>
              <p className="mt-4">{t("cookies.content")}</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("third-party.title")}
              </h2>
              <p className="mt-4">{t("third-party.content")}</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("security.title")}
              </h2>
              <p className="mt-4">{t("security.content")}</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("changes.title")}
              </h2>
              <p className="mt-4">{t("changes.content")}</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("contact.title")}
              </h2>
              <p className="mt-4">{t("contact.content")}</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("consent.title")}
              </h2>
              <p className="mt-4">{t("consent.content")}</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("lastUpdated.title")}
              </h2>
              <p className="mt-4">{t("lastUpdated.content")}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
