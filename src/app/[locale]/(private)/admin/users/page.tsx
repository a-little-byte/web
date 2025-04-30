"use client";

import { Form } from "@/components/base/Form";
import { InputField } from "@/components/base/InputField";
import { SelectField } from "@/components/base/SelectField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UserSelect } from "@/db/models/User";
import { toast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { useQuery } from "@/hooks/useQuery";
import { apiClient } from "@/lib/apiClient";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/style";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";

const userEditSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  role: z.string(),
});

type UserEditForm = z.infer<typeof userEditSchema>;

type UserWithoutPassword = Omit<UserSelect, "password" | "password_salt">;

const TableBodyLoading = () => (
  <TableRow>
    <TableCell colSpan={6}>
      <Skeleton className="h-4 w-full" />
    </TableCell>
  </TableRow>
);

const UsersPage = () => {
  const t = useTranslations("admin.users");
  const [editingUser, setEditingUser] = useState<UserWithoutPassword | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const {
    data: users,
    isSuccess,
    isLoading,
    refetch: refetchUsers,
  } = useQuery(apiClient.users);

  const editForm = useForm<UserEditForm>(userEditSchema);

  const openEditDialog = (user: UserWithoutPassword) => () => {
    setEditingUser(user);
    editForm.reset({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: UserWithoutPassword) => () => {
    setEditingUser(user);
    setIsDeleteDialogOpen(true);
  };

  const updateUserMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: UserSelect["id"];
      data: UserEditForm;
    }) => {
      const response = await apiClient.users[":id"].$patch({
        param: { id },
        json: data,
      });
      return response.json();
    },
    onSuccess: async () => {
      await refetchUsers();
      toast({
        title: t("success"),
        description: t("userUpdated"),
      });
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast({
        title: t("error"),
        description: t("errorUpdatingUser"),
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.users[":id"].$delete({
        param: { id },
      }),
    onSuccess: async () => {
      await refetchUsers();
      toast({
        title: t("success"),
        description: t("userDeleted"),
      });
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast({
        title: t("error"),
        description: t("errorDeletingUser"),
        variant: "destructive",
      });
    },
  });

  const toggleSuspensionMutation = useMutation({
    mutationFn: (id: UserSelect["id"]) =>
      apiClient.users[":id"].suspend.$patch({
        param: { id },
      }),
    onSuccess: async (_, id) => {
      await refetchUsers();
      while (isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      const user = users?.find((u) => u.id === id);
      toast({
        title: t("success"),
        description: user?.suspended_at
          ? t("userUnsuspended")
          : t("userSuspended"),
      });
    },
    onError: () => {
      toast({
        title: t("error"),
        description: t("errorTogglingSuspension"),
        variant: "destructive",
      });
    },
  });

  const handleUpdateUser = async (data: UserEditForm) => {
    if (!editingUser) return;
    updateUserMutation.mutate({ id: editingUser.id, data });
  };

  const handleDeleteUser = async () => {
    if (!editingUser) return;
    deleteUserMutation.mutate(editingUser.id);
  };

  const handleToggleSuspension = (user: UserWithoutPassword) => () =>
    toggleSuspensionMutation.mutate(user.id);

  const displaySuspendedDate = (date: string | null) => {
    if (!date) return "";
    return formatDate(date);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("email")}</TableHead>
            <TableHead>{t("role")}</TableHead>
            <TableHead>{t("verified")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("createdAt")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableBodyLoading />}
          {isSuccess &&
            users.map((user) => {
              const userData = {
                ...user,
                createdAt: new Date(user.createdAt),
                updatedAt: new Date(user.updatedAt),
                suspended_at: user.suspended_at
                  ? new Date(user.suspended_at)
                  : null,
                email_verified: user.email_verified
                  ? new Date(user.email_verified)
                  : null,
              } satisfies UserWithoutPassword;

              return (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
                        user.role === "admin"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-green-50 text-green-700"
                      )}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.email_verified ? (
                      <span className="text-green-600">
                        <CheckIcon className="h-4 w-4" />
                      </span>
                    ) : (
                      <span className="text-red-600">
                        <XIcon className="h-4 w-4" />
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.suspended_at ? (
                      <span
                        className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700"
                        title={`Suspended on: ${displaySuspendedDate(user.suspended_at)}`}
                      >
                        {t("suspended")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        {t("active")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openEditDialog(userData)}
                      >
                        {t("edit")}
                      </Button>
                      <Button
                        variant={user.suspended_at ? "outline" : "secondary"}
                        size="sm"
                        onClick={handleToggleSuspension(userData)}
                      >
                        {user.suspended_at ? t("unsuspend") : t("suspend")}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={openDeleteDialog(userData)}
                      >
                        {t("delete")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editUser")}</DialogTitle>
            <DialogDescription>{t("updateUserDetails")}</DialogDescription>
          </DialogHeader>
          <Form
            form={editForm}
            onSubmit={handleUpdateUser}
            className="space-y-4"
          >
            <InputField
              control={editForm.control}
              name="first_name"
              label={t("firstName")}
            />
            <InputField
              control={editForm.control}
              name="last_name"
              label={t("lastName")}
            />
            <InputField
              control={editForm.control}
              name="email"
              label={t("email")}
              type="email"
            />
            <SelectField
              control={editForm.control}
              name="role"
              label={t("role")}
              placeholder={t("selectRole")}
              options={[
                { label: t("user"), value: "user" },
                { label: t("admin"), value: "admin" },
              ]}
            />
            <DialogFooter>
              <Button type="submit" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? t("saving") : t("save")}
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteUser")}</DialogTitle>
            <DialogDescription>{t("deleteUserConfirmation")}</DialogDescription>
          </DialogHeader>
          <p>
            {t("deleteUserWarning", {
              name: editingUser
                ? `${editingUser.first_name} ${editingUser.last_name}`
                : "",
              email: editingUser?.email || "",
            })}
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? t("deleting") : t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
