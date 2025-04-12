"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, CreditCard, Trash2, CheckCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface PaymentMethod {
  id: string;
  type: string;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const mockData = [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            type: "visa",
            last_four: "4242",
            expiry_month: 12,
            expiry_year: 2025,
            is_default: true
          },
          {
            id: "223e4567-e89b-12d3-a456-426614174001",
            type: "mastercard",
            last_four: "8888",
            expiry_month: 3,
            expiry_year: 2026,
            is_default: false
          }
        ];
        
        setPaymentMethods(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        is_default: method.id === id
      }))
    );
  };

  const handleDelete = (id: string) => {
    setPaymentMethods(
      paymentMethods.filter(method => method.id !== id)
    );
  };

  const formatExpiry = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  return (
    <div >
      <div className="container">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">
            Payment Methods
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-center">
            Manage your payment methods securely and conveniently
          </p>

          <div className="mt-10 grid gap-6">
            {loading ? (
              <Card className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Loading payment methods...</p>
              </Card>
            ) : paymentMethods.length === 0 ? (
              <Card className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">No payment methods found</p>
              </Card>
            ) : (
              paymentMethods.map((method) => (
                <Card key={method.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <CreditCard className="h-8 w-8 text-primary" />                    <div>
                      <CardTitle className="capitalize">
                        {method.type} •••• {method.last_four}
                        {method.is_default && (
                          <span className="ml-2 inline-flex items-center text-sm text-green-600">
                            <CheckCircle className="mr-1 h-4 w-4" /> Default
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Expires {formatExpiry(method.expiry_month, method.expiry_year)}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    {!method.is_default && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set as default
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive"
                      onClick={() => handleDelete(method.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}

            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Button variant="outline" className="gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Add new payment method
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">
              Payment Information
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Your payment information is securely stored and processed. We never store your full card details on our servers.
            </p>
            <ul className="mt-6 space-y-2 text-muted-foreground">
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                PCI DSS compliant processing
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                End-to-end encryption
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Automatic card verification
              </li>
            </ul>
          </div>

          <div className="mt-16 text-center">
            <Button size="lg">
              Manage Billing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
