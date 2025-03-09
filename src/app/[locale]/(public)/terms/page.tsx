"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useState } from "react";

const Terms = () => {
  const [accepted, setAccepted] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("terms");

  const handleAccept = () => {
    setAccepted(true);
    localStorage.setItem("terms-accepted", "true");
    toast({
      title: t("accepted"),
      description: t("acceptedMessage"),
    });
  };

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">{t("lastUpdated")}</p>

          <ScrollArea className="h-[600px] rounded-md border p-6 mb-8">
            <div className="space-y-8">
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
                  {t("service.items", { count: 4 }).map(
                    (item: string, index: number) => (
                      <li key={index}>{item}</li>
                    )
                  )}
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
                <h2 className="text-2xl font-semibold mb-4">
                  {t("sla.title")}
                </h2>
                <p>{t("sla.content")}</p>
                <p className="mt-4">{t("sla.disruption")}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {t("data.title")}
                </h2>
                <p>{t("data.content")}</p>
                <ul className="list-disc pl-6 mt-2">
                  {t("data.measures", { count: 4 }).map(
                    (measure: string, index: number) => (
                      <li key={index}>{measure}</li>
                    )
                  )}
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
          </ScrollArea>

          <div className="flex items-center space-x-2 mb-6">
            <Checkbox
              id="terms"
              checked={accepted}
              onCheckedChange={() => setAccepted(!accepted)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("accept")}
            </label>
          </div>

          <Button onClick={handleAccept} disabled={!accepted}>
            {accepted ? t("accepted") : t("accept")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Terms;
