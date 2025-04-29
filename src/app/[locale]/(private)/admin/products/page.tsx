"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
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
import { useQuery } from "@/hooks/useQuery";
import { apiClient } from "@/lib/apiClient";
import { formatCurrency } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.coerce.number().min(0, { message: "Price must be at least 0" }),
  category_id: z.string().uuid({ message: "Please select a category" }),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductsPage = () => {
  const t = useTranslations("admin");
  const locale = useLocale();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      category_id: "",
    },
  });
  const {
    data: products,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useQuery(apiClient.products);
  const { data: categories, isLoading: isLoadingCategories } = useQuery(
    apiClient.products.categories
  );
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const response = await apiClient.products.$post({
        json: data,
      });
      return response.json();
    },
    onSuccess: async () => {
      await refetchProducts();
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ProductFormValues>;
    }) => {
      const response = await apiClient.products[":id"].$patch({
        param: { id },
        json: data,
      });
      return response.json();
    },
    onSuccess: async () => {
      await refetchProducts();
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      setEditingProduct(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    },
  });
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.products[":id"].$delete({
        param: { id },
      });
      return response.json();
    },
    onSuccess: async () => {
      await refetchProducts();
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      price: product.price,
      category_id: product.category_id,
    });
  };

  const onSubmit = (values: ProductFormValues) => {
    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct.id,
        data: values,
      });
    } else {
      createProductMutation.mutate(values);
    }
  };

  const handleDialogClose = () => {
    if (editingProduct) {
      setEditingProduct(null);
    } else {
      setIsCreateDialogOpen(false);
    }
    form.reset();
  };

  if (isLoadingProducts || isLoadingCategories) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Product</span>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.categoryName}</TableCell>
              <TableCell>{formatCurrency(locale, product.price)}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this product?"
                      )
                    ) {
                      deleteProductMutation.mutate(product.id);
                    }
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={isCreateDialogOpen || editingProduct !== null}
        onOpenChange={handleDialogClose}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name">Name</label>
                <Input
                  id="name"
                  placeholder="Product name"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="price">Price</label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register("price")}
                />
                {form.formState.errors.price && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="category">Category</label>
                <Select
                  onValueChange={(value) => form.setValue("category_id", value)}
                  defaultValue={form.getValues("category_id")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category_id && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.category_id.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createProductMutation.isPending ||
                    updateProductMutation.isPending
                  }
                >
                  {editingProduct ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
