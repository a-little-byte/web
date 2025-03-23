import { getTranslations } from "next-intl/server";

const Terms = async () => {
  const t = await getTranslations("terms");

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">{t("lastUpdated")}</p>
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("intro.title")}
              </h2>
              <p>{t("intro.content")}</p>
              <p className="mt-4">{t("intro.agreement")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("service.title")}
              </h2>
              <p>{t("service.content")}</p>
              <ul className="list-disc pl-6 mt-2">
                {Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <li key={i}>{t(`service.items.${i}`)}</li>
                  ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("accounts.title")}
              </h2>
              <p>{t("accounts.content")}</p>
              <p className="mt-4">{t("accounts.responsibility")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("subscription.title")}
              </h2>
              <p>{t("subscription.content")}</p>
              <p className="mt-4">{t("subscription.payment")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("sla.title")}</h2>
              <p>{t("sla.content")}</p>
              <p className="mt-4">{t("sla.disruption")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("data.title")}</h2>
              <p>{t("data.content")}</p>
              <ul className="list-disc pl-6 mt-2">
                {Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <li key={i}>{t(`data.measures.${i}`)}</li>
                  ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("ip.title")}</h2>
              <p>{t("ip.content")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("termination.title")}
              </h2>
              <p>{t("termination.content")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("liability.title")}
              </h2>
              <p>{t("liability.content")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("changes.title")}
              </h2>
              <p>{t("changes.content")}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
