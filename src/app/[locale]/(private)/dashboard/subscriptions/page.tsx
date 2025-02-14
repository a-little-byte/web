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
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronDown, Download, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface OrderDetails {
  id: string;
  service_name: string;
  amount: number;
  status: string;
  created_at: string;
  subscription_period: string;
  payment_method?: {
    type: string;
    last_four: string;
  };
  billing_address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  invoice?: {
    number: string;
    file_url: string;
  };
}

export default function Subscriptions() {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("payments")
        .select(
          `
          id,
          amount,
          status,
          created_at,
          billing_address_id,
          payment_method_id,
          subscriptions (
            service_id,
            services (
              name
            )
          ),
          billing_addresses!billing_address_id (
            street,
            city,
            state,
            postal_code,
            country
          ),
          payment_methods!payment_method_id (
            type,
            last_four
          ),
          invoices (
            number,
            file_url
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedOrders = data.map((order) => ({
        id: order.id,
        service_name: order.subscriptions.services.name,
        amount: order.amount,
        status: order.status,
        created_at: order.created_at,
        subscription_period: "monthly", // You might want to get this from the subscription
        payment_method: order.payment_methods,
        billing_address: order.billing_addresses,
        invoice: order.invoices?.[0],
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredOrders = filterOrders();
  const groupedOrders = groupOrdersByYear(filteredOrders);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Historique des commandes</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une commande..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[300px]"
            />
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les années</SelectItem>
              {getYears().map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="cancelled">Résiliée</SelectItem>
              <SelectItem value="expired">Expirée</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les services</SelectItem>
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
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
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
                            ? "Active"
                            : order.status === "cancelled"
                            ? "Résiliée"
                            : "Expirée"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Détails
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Détails de la commande</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-6">
                              <div className="grid grid-cols-2 gap-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>
                                      Informations de paiement
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <dl className="space-y-2">
                                      <div>
                                        <dt className="text-sm text-muted-foreground">
                                          Méthode de paiement
                                        </dt>
                                        <dd>
                                          {order.payment_method?.type} ••••{" "}
                                          {order.payment_method?.last_four}
                                        </dd>
                                      </div>
                                      <div>
                                        <dt className="text-sm text-muted-foreground">
                                          Montant
                                        </dt>
                                        <dd>${order.amount}</dd>
                                      </div>
                                      <div>
                                        <dt className="text-sm text-muted-foreground">
                                          Date
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
                                      Adresse de facturation
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
                                    <CardTitle>Facture</CardTitle>
                                    <CardDescription>
                                      Numéro de facture: {order.invoice.number}
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
                                      Télécharger la facture
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
          <p className="text-muted-foreground">Aucune commande trouvée</p>
        </div>
      )}
    </div>
  );
}
