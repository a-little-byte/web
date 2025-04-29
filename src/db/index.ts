import type { BillingAddress } from "@/db/models/BillingAddress";
import type { CartItem } from "@/db/models/CartItem";
import type { CasbinRule } from "@/db/models/CasbinRule";
import type { ChatConversation, ChatMessage } from "@/db/models/Chat";
import type { HeroCarousel } from "@/db/models/HeroCarousel";
import type { InformationSchemaTables } from "@/db/models/Information";
import type { Invoice } from "@/db/models/Invoice";
import type { LoginAttempts } from "@/db/models/LoginAttempts";
import type { Payment, PaymentMethod } from "@/db/models/Payment";
import type { Product } from "@/db/models/Product";
import type { ProductCategory } from "@/db/models/ProductCategory";
import type { Service } from "@/db/models/Service";
import type { Subscription } from "@/db/models/Subscription";
import type { TOTPSecret, TOTPTemp } from "@/db/models/Totp";
import type { User } from "@/db/models/User";
import type { Verification } from "@/db/models/Verification";
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
  "information_schema.tables": InformationSchemaTables;
  verification: Verification;
  payments: Payment;
  payment_methods: PaymentMethod;
  subscriptions: Subscription;
  totp_secrets: TOTPSecret;
  totp_temp: TOTPTemp;
  hero_carousel: HeroCarousel;
  casbin_rule: CasbinRule;
  login_attempts: LoginAttempts;
  product_categories: ProductCategory;
  products: Product;
}
