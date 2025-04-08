import { ResetPasswordForm } from "@/app/[locale]/(public)/auth/reset-password/_components/ResetPasswordForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, locales } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) => {
  const token = (await searchParams).token;
  const t = await getTranslations("auth.resetPassword");

  if (!token) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{t("invalidLink.title")}</CardTitle>
            <CardDescription>{t("invalidLink.description")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/forgot-password">{t("invalidLink.requestNew")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{t("form.title")}</CardTitle>
          <CardDescription>{t("form.description")}</CardDescription>
          <ResetPasswordForm />
        </CardHeader>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
