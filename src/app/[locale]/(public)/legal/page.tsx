"use client";

import { useTranslations } from "next-intl";

export default function Legal() {
  const t = useTranslations("legal");

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

        <div className="prose dark:prose-invert max-w-none space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("copyright.title")}
            </h2>
            <p>{t("copyright.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("trademark.title")}
            </h2>
            <p>{t("trademark.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("disclaimer.title")}
            </h2>
            <p>{t("disclaimer.content")}</p>
            <p className="mt-4">{t("disclaimer.additional")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("liability.title")}
            </h2>
            <p>{t("liability.content")}</p>
            <p className="mt-4">{t("liability.additional")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("export.title")}</h2>
            <p>{t("export.content")}</p>
            <p className="mt-4">{t("export.additional")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("governing.title")}
            </h2>
            <p>{t("governing.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("contact.title")}
            </h2>
            <p>{t("contact.content")}</p>
            <div className="mt-4">
              <p>{t("contact.company")}</p>
              <p>{t("contact.address.line1")}</p>
              <p>{t("contact.address.line2")}</p>
              <p>{t("contact.address.line3")}</p>
              <p>{t("contact.address.line4")}</p>
              <p className="mt-2">{t("contact.email")}</p>
              <p>{t("contact.phone")}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("changes.title")}
            </h2>
            <p>{t("changes.content")}</p>
            <p className="mt-4">{t("changes.additional")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("lastUpdated.title")}
            </h2>
            <p>{t("lastUpdated.content")}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
