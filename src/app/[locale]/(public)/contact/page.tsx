"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const message = formData.get("message");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const company = formData.get("company");
    const interest = formData.get("interest");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          subject: `New Contact Form Submission from ${firstName} ${lastName}`,
          message: `
            Name: ${firstName} ${lastName}
            Company: ${company}
            Interest: ${interest}
            Message: ${message}
          `,
        }),
      });

      if (response.ok) {
        toast({
          title: "Message sent successfully",
          description: "We'll get back to you as soon as possible.",
        });
        e.currentTarget.reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">
            Contact Us
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-center">
            Get in touch with our security experts. We'll help you find the
            right solution for your business.
          </p>

          <form onSubmit={handleSubmit} className="mt-16 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" name="lastName" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest">I'm interested in</Label>
              <Select name="interest">
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soc">SOC as a Service</SelectItem>
                  <SelectItem value="edr">EDR Protection</SelectItem>
                  <SelectItem value="xdr">XDR Platform</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us about your security needs"
                className="min-h-[150px]"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
