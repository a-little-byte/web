"use server";

import { BillingAddress } from "@/db/models/BillingAddress";
import { CartItem } from "@/db/models/CartItem";
import { ChatConversation, ChatMessage } from "@/db/models/Chat";
import { HeroCarousel } from "@/db/models/HeroCarousel";
import { Invoice } from "@/db/models/Invoice";
import { Payment, PaymentMethod } from "@/db/models/Payment";
import { Service } from "@/db/models/Service";
import { Subscription } from "@/db/models/Subscription";
import { TOTPSecret, TOTPTemp } from "@/db/models/Totp";
import { User } from "@/db/models/User";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      database: "test",
      host: "localhost",
      user: "admin",
      password: "admin",
      port: 5432,
      max: 10,
    }),
  }),
});

export interface Database {
  users: User;
  services: Service;
  billing_addresses: BillingAddress;
  cart_items: CartItem;
  chat_conversations: ChatConversation;
  chat_messages: ChatMessage;
  invoices: Invoice;
  payments: Payment;
  payment_methods: PaymentMethod;
  subscriptions: Subscription;
  totp_secrets: TOTPSecret;
  totp_temp: TOTPTemp;
  hero_carousel: HeroCarousel;
}
