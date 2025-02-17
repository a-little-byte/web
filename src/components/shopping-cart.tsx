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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  ShoppingCart as CartIcon,
  Loader2,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CartItem {
  id: string;
  service_id: string;
  quantity: number;
  services: {
    name: string;
    description: string;
    price: number;
    period: string;
  };
}

export function ShoppingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen]);

  const fetchCartItems = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          id,
          service_id,
          quantity,
          services (
            name,
            description,
            price,
            period
          )
        `,
        )
        .eq("user_id", session.user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch cart items",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", itemId);

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        const returnTo = "/checkout";
        router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cartItems }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate checkout",
        variant: "destructive",
      });
    }
  };

  const total = cartItems.reduce((sum, item) => {
    return sum + item.services.price * item.quantity;
  }, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <CartIcon className="h-5 w-5" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
          <span className="sr-only">Shopping cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Your cart is empty
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between space-x-4 border-b pb-4"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{item.services.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${item.services.price}/{item.services.period}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={isLoading || item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={isLoading}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeItem(item.id)}
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
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
