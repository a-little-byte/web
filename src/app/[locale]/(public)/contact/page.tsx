import { ContactForm } from "@/app/[locale]/(public)/contact/_components/ContactForm";
import { getTranslations } from "next-intl/server";

const ContactPage = async () => {
  const t = await getTranslations("contact");

  return (
    <div className="py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-center">
            {t("subtitle")}
          </p>

          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
