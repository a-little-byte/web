"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Service } from "@/db/schema";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/src/lib/db";
import { useEffect, useState } from "react";

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const services = await db
        .selectFrom("services")
        .selectAll()
        .orderBy("created_at")
        .execute();

      setServices(services);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const serviceData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      period: formData.get("period") as string,
    };

    try {
      if (currentService) {
        await db
          .updateTable("services")
          .set(serviceData)
          .where("id", "=", currentService.id)
          .execute();
      } else {
        await db.insertInto("services").values(serviceData).execute();
      }

      toast({
        title: "Success",
        description: `Service ${
          currentService ? "updated" : "created"
        } successfully`,
      });

      setIsOpen(false);
      setCurrentService(null);
      fetchServices();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (service: Service) => {
    setCurrentService(service);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await db.deleteFrom("services").where("id", "=", id).execute();

      toast({
        title: "Success",
        description: "Service deleted successfully",
      });

      fetchServices();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentService(null)}>Add Service</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={currentService?.name}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={currentService?.description}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium mb-1"
                >
                  Price
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={currentService?.price}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="period"
                  className="block text-sm font-medium mb-1"
                >
                  Period
                </label>
                <Input
                  id="period"
                  name="period"
                  defaultValue={currentService?.period}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {currentService ? "Update" : "Create"} Service
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>${service.price}</TableCell>
              <TableCell>{service.period}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
