"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@/hooks/useQuery";
import { apiClient } from "@/lib/apiClient";
import { formatDate } from "@/lib/formatters";
import { useTranslations } from "next-intl";
import { useState } from "react";

type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  email_verified: string | null;
  suspended_at: string | null;
  createdAt: string;
  updatedAt: string;
};

const UsersPage = () => {
  const t = useTranslations("admin.users");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const {
    data: users,
    isSuccess,
    refetch: refetchUsers,
  } = useQuery(apiClient.users);

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setRole(user.role);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setEditingUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      setIsLoading(true);

      const response = await apiClient.users[":id"].$patch({
        param: { id: editingUser.id },
        json: {
          first_name: firstName,
          last_name: lastName,
          email,
          role,
        },
      });
      const user = await response.json();

      if (user) {
        await refetchUsers();
        toast({
          title: t("success"),
          description: t("userUpdated"),
        });
      }
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: t("error"),
        description: t("errorUpdatingUser"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!editingUser) return;

    try {
      setIsLoading(true);
      await apiClient.users[":id"].$delete({
        param: { id: editingUser.id },
      });
      await refetchUsers();
      toast({
        title: t("success"),
        description: t("userDeleted"),
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: t("error"),
        description: t("errorDeletingUser"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSuspension = async (user: User) => {
    try {
      setIsLoading(true);

      // If already suspended, set to null to unsuspend
      // Otherwise create new suspension with current date
      const suspendedAt = user.suspended_at ? null : new Date().toISOString();

      const response = await apiClient.users[":id"].suspend.$patch({
        param: { id: user.id },
      });
      const updatedUser = await response.json();

      if (updatedUser) {
        await refetchUsers();
        toast({
          title: t("success"),
          description: user.suspended_at
            ? t("userUnsuspended")
            : t("userSuspended"),
        });
      }
    } catch (error) {
      console.error("Error toggling user suspension:", error);
      toast({
        title: t("error"),
        description: t("errorTogglingSuspension"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to display suspension date nicely
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
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  {user.email_verified ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✗</span>
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
                      onClick={() => openEditDialog(user)}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      variant={user.suspended_at ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => handleToggleSuspension(user)}
                    >
                      {user.suspended_at ? t("unsuspend") : t("suspend")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(user)}
                    >
                      {t("delete")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editUser")}</DialogTitle>
            <DialogDescription>{t("updateUserDetails")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="first_name" className="text-right">
                {t("firstName")}
              </label>
              <Input
                id="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="last_name" className="text-right">
                {t("lastName")}
              </label>
              <Input
                id="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                {t("email")}
              </label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="role" className="text-right">
                {t("role")}
              </label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{t("user")}</SelectItem>
                  <SelectItem value="admin">{t("admin")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleUpdateUser}
              disabled={isLoading}
            >
              {isLoading ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
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
              disabled={isLoading}
            >
              {isLoading ? t("deleting") : t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;

export const TableBodyLoading = () => {
  return (
    <TableRow>
      <TableCell colSpan={6}>
        <Skeleton className="h-4 w-full" />
      </TableCell>
    </TableRow>
  );
};
