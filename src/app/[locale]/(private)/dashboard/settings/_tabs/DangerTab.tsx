"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "@/lib/i18n/routing";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export const DangerTab = () => {
  const t = useTranslations("dashboard.settings.danger");
  const { mutateAsync: accountDeletionMutation, isPending } = useMutation({
    mutationFn: () => apiClient.account.$delete(),
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleAccountDeletion = async () => {
    try {
      await accountDeletionMutation();

      router.push("/");

      toast({
        title: t("toasts.success.title"),
        description: t("toasts.success.description"),
      });
    } catch (error) {
      toast({
        title: t("toasts.error.title"),
        description: t("toasts.error.description"),
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isPending}>
              {t("deleteAccount.button")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("deleteAccount.dialog.title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteAccount.dialog.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("deleteAccount.dialog.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleAccountDeletion}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("deleteAccount.dialog.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
