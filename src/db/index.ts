"use server";

import type {
  BillingAddress,
  CartItem,
  ChatConversation,
  ChatMessage,
  HeroCarousel,
  Invoice,
  Payment,
  PaymentMethod,
  Service,
  Subscription,
  TOTPSecret,
  TOTPTemp,
  User,
} from "@/db/utils";
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
  hero_carousels: HeroCarousel;
  invoices: Invoice;
  payments: Payment;
  payment_methods: PaymentMethod;
  subscriptions: Subscription;
  totp_secrets: TOTPSecret;
  totp_temp: TOTPTemp;
  hero_carousel: HeroCarousel;
}
