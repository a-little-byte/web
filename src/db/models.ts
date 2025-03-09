import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import { UUID } from "node:crypto";

export type Service = {
  id: Generated<UUID>;
  name: string;
  description: string;
  price: number;
  period: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
};

export type ServiceSelect = Selectable<Service>;
export type ServiceInsert = Insertable<Service>;
export type ServiceUpdate = Updateable<Service>;

export type User = {
  id: Generated<UUID>;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  email_verified: boolean;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
};

export type UserSelect = Selectable<User>;
export type UserInsert = Insertable<User>;
export type UserUpdate = Updateable<User>;

export type Subscription = {
  id: Generated<UUID>;
  user_id: UUID;
  service_id: UUID;
  status: string;
  current_period_start: Date;
  current_period_end: Date;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
};

export type SubscriptionSelect = Selectable<Subscription>;
export type SubscriptionInsert = Insertable<Subscription>;
export type SubscriptionUpdate = Updateable<Subscription>;

export type BillingAddress = {
  id: Generated<UUID>;
  user_id: UUID;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
};

export type BillingAddressSelect = Selectable<BillingAddress>;
export type BillingAddressInsert = Insertable<BillingAddress>;
export type BillingAddressUpdate = Updateable<BillingAddress>;

export type ChatConversation = {
  id: Generated<UUID>;
  user_id: UUID;
  title: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
};

export type ChatConversationSelect = Selectable<ChatConversation>;
export type ChatConversationInsert = Insertable<ChatConversation>;
export type ChatConversationUpdate = Updateable<ChatConversation>;

export type ChatMessage = {
  id: Generated<UUID>;
  conversation_id: UUID;
  role: string;
  content: string;
  created_at: Generated<Date>;
};

export type ChatMessageSelect = Selectable<ChatMessage>;
export type ChatMessageInsert = Insertable<ChatMessage>;
export type ChatMessageUpdate = Updateable<ChatMessage>;

export type CartItem = {
  id: Generated<UUID>;
  user_id: UUID;
  service_id: UUID;
  quantity: number;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
};

export type CartItemSelect = Selectable<CartItem>;
export type CartItemInsert = Insertable<CartItem>;
export type CartItemUpdate = Updateable<CartItem>;

export type HeroCarousel = {
  id: Generated<UUID>;
  title: string;
  description: string;
  image_url: string;
  button_text?: string;
  button_link?: string;
  order: number;
  active: boolean;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
};

export type HeroCarouselSelect = Selectable<HeroCarousel>;
export type HeroCarouselInsert = Insertable<HeroCarousel>;
export type HeroCarouselUpdate = Updateable<HeroCarousel>;

export type Invoice = {
  id: Generated<UUID>;
  payment_id: string | null;
  number: string;
  file_url: string;
  created_at: Generated<Date>;
};

export type InvoiceSelect = Selectable<Invoice>;
export type InvoiceInsert = Insertable<Invoice>;
export type InvoiceUpdate = Updateable<Invoice>;

export type PaymentMethod = {
  id: Generated<UUID>;
  user_id: UUID | null;
  type: string;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
};

export type PaymentMethodSelect = Selectable<PaymentMethod>;
export type PaymentMethodInsert = Insertable<PaymentMethod>;
export type PaymentMethodUpdate = Updateable<PaymentMethod>;

export type Payment = {
  id: Generated<UUID>;
  subscription_id: UUID;
  amount: number;
  status: string;
  payment_method: string;
  created_at: Generated<Date>;
  billing_address_id: UUID | null;
  payment_method_id: UUID | null;
};

export type PaymentSelect = Selectable<Payment>;
export type PaymentInsert = Insertable<Payment>;
export type PaymentUpdate = Updateable<Payment>;

export type TOTPSecret = {
  id: Generated<UUID>;
  user_id: UUID;
  secret: string;
  enabled: boolean;
};

export type TOTPSecretSelect = Selectable<TOTPSecret>;
export type TOTPSecretInsert = Insertable<TOTPSecret>;
export type TOTPSecretUpdate = Updateable<TOTPSecret>;

export type TOTPTemp = {
  id: Generated<UUID>;
  user_id: UUID;
  secret: string;
  created_at: Generated<Date>;
};

export type TOTPTempSelect = Selectable<TOTPTemp>;
export type TOTPTempInsert = Insertable<TOTPTemp>;
