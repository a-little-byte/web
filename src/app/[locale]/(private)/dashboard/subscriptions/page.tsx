"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { InferResponseType } from "hono";
import { ChevronDown, Download, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type OrderDetails = Exclude<
  InferResponseType<typeof apiClient.orders.$get>,
  { error: string }
>[0];

export default function Subscriptions() {
  const t = useTranslations("dashboard.subscriptions");
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)auth-token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      const response = await apiClient.orders.$get(
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast({
        title: t("toasts.fetchError.title"),
        description: t("toasts.fetchError.description"),
        variant: "destructive",
      });
    }
  };

  const filterOrders = () => {
    return orders.filter((order) => {
      const orderYear = new Date(order.created_at).getFullYear().toString();
      const matchesYear = selectedYear === "all" || orderYear === selectedYear;
      const matchesStatus =
        selectedStatus === "all" || order.status === selectedStatus;
      const matchesService =
        selectedService === "all" || order.service_name === selectedService;
      const matchesSearch =
        order.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesYear && matchesStatus && matchesService && matchesSearch;
    });
  };

  const getYears = () => {
    const years = new Set(
      orders.map((order) => new Date(order.created_at).getFullYear().toString())
    );
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  };

  const getServices = () => {
    return Array.from(new Set(orders.map((order) => order.service_name)));
  };

  const groupOrdersByYear = (filteredOrders: OrderDetails[]) => {
    const grouped: { [key: string]: OrderDetails[] } = {};

    filteredOrders.forEach((order) => {
      const year = new Date(order.created_at).getFullYear().toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(order);
    });

    return grouped;
  };

  const downloadInvoice = async (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  const filteredOrders = filterOrders();
  const groupedOrders = groupOrdersByYear(filteredOrders);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[300px]"
            />
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t("filters.year.label")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.year.all")}</SelectItem>
              {getYears().map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t("filters.status.label")} />
            </SelectTrigger>
            <SelectContent>
              {["all", "active", "cancelled", "expired"].map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`filters.status.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("filters.service.label")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.service.all")}</SelectItem>
              {getServices().map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {Object.entries(groupedOrders)
        .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
        .map(([year, yearOrders]) => (
          <div key={year} className="space-y-4">
            <h2 className="text-2xl font-semibold">{year}</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    {["service", "date", "amount", "status", "actions"].map(
                      (header) => (
                        <TableHead key={header}>
                          {t(`table.headers.${header}`)}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {yearOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.service_name}</TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), "dd MMMM yyyy", {
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell>${order.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "active"
                              ? "default"
                              : order.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {order.status === "active"
                            ? t("table.headers.status.active")
                            : order.status === "cancelled"
                              ? t("table.headers.status.cancelled")
                              : t("table.headers.status.expired")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              {t("table.actions.details")}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{t("details.title")}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-6">
                              <div className="grid grid-cols-2 gap-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>
                                      {t("details.payment.title")}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <dl className="space-y-2">
                                      <div>
                                        <dt className="text-sm text-muted-foreground">
                                          {t("details.payment.method")}
                                        </dt>
                                        <dd>
                                          {order.payment_method?.type} ••••{" "}
                                          {order.payment_method?.last_four}
                                        </dd>
                                      </div>
                                      <div>
                                        <dt className="text-sm text-muted-foreground">
                                          {t("details.payment.amount")}
                                        </dt>
                                        <dd>${order.amount}</dd>
                                      </div>
                                      <div>
                                        <dt className="text-sm text-muted-foreground">
                                          {t("details.payment.date")}
                                        </dt>
                                        <dd>
                                          {format(
                                            new Date(order.created_at),
                                            "PPP",
                                            { locale: fr }
                                          )}
                                        </dd>
                                      </div>
                                    </dl>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader>
                                    <CardTitle>
                                      {t("details.billing.title")}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    {order.billing_address && (
                                      <address className="not-italic">
                                        {order.billing_address.street}
                                        <br />
                                        {order.billing_address.city},{" "}
                                        {order.billing_address.state}
                                        <br />
                                        {order.billing_address.postal_code}
                                        <br />
                                        {order.billing_address.country}
                                      </address>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                              {order.invoice && (
                                <Card>
                                  <CardHeader>
                                    <CardTitle>
                                      {t("details.invoice.title")}
                                    </CardTitle>
                                    <CardDescription>
                                      {t("details.invoice.number", {
                                        number: order.invoice.number,
                                      })}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        downloadInvoice(order.invoice!.file_url)
                                      }
                                    >
                                      <Download className="mr-2 h-4 w-4" />
                                      {t("details.invoice.download")}
                                    </Button>
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        ))}

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noOrders")}</p>
        </div>
      )}
    </div>
  );
}
