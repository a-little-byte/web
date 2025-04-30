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

type CartItemWithService = {
  services_name: string;
  services_price: number;
} & CartItemSelect;

export const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemWithService[] | null>(
    null,
  );
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
      const response = await apiClient.account.cart.$get();

      const data = await response.json();
      if (data.length > 0) {
        setCartItems(
          data.map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          })),
        );
      } else {
        setCartItems([]);
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
      await apiClient.account.cart[":id"].$patch({
        param: { id: itemId },
        json: { quantity },
      });
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
      await apiClient.account.cart[":id"].$delete({
        param: { id: itemId },
      });
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
      const response = await apiClient.checkout.$post({});
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

  const total =
    cartItems?.reduce(
      (sum, item) => sum + (item.services_price || 0) * item.quantity,
      0,
    ) ?? 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-primary/10 transition-colors"
        >
          <CartIcon className="h-5 w-5" />
          {cartItems?.length && cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center shadow-sm animate-in zoom-in-50 duration-300">
              {cartItems.length}
            </span>
          )}
          <span className="sr-only">{t("title")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col border-l shadow-lg">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <CartIcon className="h-5 w-5" />
            {t("title")}
          </SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : cartItems?.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4 py-10">
            <CartIcon className="h-16 w-16 opacity-20" />
            <p className="text-center">{t("empty")}</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 py-4">
              <div className="space-y-6">
                {cartItems?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between space-x-4 border-b pb-6 group hover:bg-muted/30 p-3 rounded-lg transition-colors"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{item.services_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t("item.pricePerPeriod", {
                          price: item.services_price,
                          period: item.duration,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 bg-background rounded-md border shadow-sm">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={updateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading || item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={updateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
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
            <div className="border-t pt-6 space-y-4 mt-auto bg-background/80 backdrop-blur-sm">
              <div className="flex items-center justify-between text-lg font-medium">
                <span>{t("total")}</span>
                <span className="text-primary font-bold">
                  ${total.toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full font-semibold transition-all hover:scale-[1.02]"
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {t("checkout")}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
