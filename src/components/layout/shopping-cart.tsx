"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartItemSelect } from "@/db/models/CartItem";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/apiClient";
import {
  ShoppingCart as CartIcon,
  Loader2,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemSelect[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("shoppingCart");

  useEffect(() => {
    fetchCartItems();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.account.cart.$get(
        {},
        {
          headers: {
            Authorization: `Bearer ${document.cookie.replace(
              /(?:(?:^|.*;\s*)auth-token\s*\=\s*([^;]*).*$)|^.*$/,
              "$1",
            )}`,
          },
        },
      );
      const data = await response.json();
      if (data.length > 0) {
        setCartItems(
          data.map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          })),
        );
      }
    } catch (error) {
      toast({
        title: t("errors.fetchItems.title"),
        description: t("errors.fetchItems.description"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => async () => {
    if (quantity < 1) return;

    setIsLoading(true);
    try {
      await apiClient.account.cart[":id"].$patch(
        {
          param: { id: itemId },
          json: { quantity },
        },
        {
          headers: {
            Authorization: `Bearer ${document.cookie.replace(
              /(?:(?:^|.*;\s*)auth-token\s*\=\s*([^;]*).*$)|^.*$/,
              "$1",
            )}`,
          },
        },
      );
      await fetchCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: t("errors.updateQuantity.title"),
        description: t("errors.updateQuantity.description"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = (itemId: string) => async () => {
    setIsLoading(true);
    try {
      await apiClient.account.cart[":id"].$delete(
        {
          param: { id: itemId },
        },
        {
          headers: {
            Authorization: `Bearer ${document.cookie.replace(
              /(?:(?:^|.*;\s*)auth-token\s*\=\s*([^;]*).*$)|^.*$/,
              "$1",
            )}`,
          },
        },
      );
      await fetchCartItems();
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: t("errors.removeItem.title"),
        description: t("errors.removeItem.description"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await apiClient.checkout.$post(
        {},
        {
          headers: {
            Authorization: `Bearer ${document.cookie.replace(
              /(?:(?:^|.*;\s*)auth-token\s*\=\s*([^;]*).*$)|^.*$/,
              "$1",
            )}`,
          },
        },
      );
      const data = await response.json();

      if ("url" in data && data.url !== null) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      toast({
        title: t("errors.checkout.title"),
        description: t("errors.checkout.description"),
        variant: "destructive",
      });
    }
  };

  const total = 0;
  // cartItems?.reduce(
  //   (sum, item) => sum + item.services?.price * item.quantity,
  //   0
  // ) ?? 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <CartIcon className="h-5 w-5" />
          {cartItems?.length && cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
          <span className="sr-only">{t("title")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : cartItems?.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            {t("empty")}
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {cartItems?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between space-x-4 border-b pb-4"
                  >
                    <div className="space-y-1">
                      {/* <h4 className="font-medium">{item.services.name}</h4> */}
                      <p className="text-sm text-muted-foreground">
                        {/* {t("item.pricePerPeriod", {
                          price: item.services.price,
                          period: item.services.period,
                        })} */}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={updateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading || item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={updateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={removeItem(item.id)}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-medium">
                <span>{t("total")}</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {t("checkout")}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
