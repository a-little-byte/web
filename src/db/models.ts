import type { Insertable, Selectable, Updateable } from "kysely";
import { UUID } from "node:crypto";

export type Service = {
  id: UUID;
  name: string;
  description: string;
  price: number;
  period: string;
  created_at: Date;
  updated_at: Date;
};

export type ServiceSelect = Selectable<Service>;
export type ServiceInsert = Insertable<Service>;
export type ServiceUpdate = Updateable<Service>;

export type User = {
  id: UUID;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
};

export type UserSelect = Selectable<User>;
export type UserInsert = Insertable<User>;
export type UserUpdate = Updateable<User>;

export type Subscription = {
  id: UUID;
  user_id: UUID;
  service_id: UUID;
  status: string;
  current_period_start: Date;
  current_period_end: Date;
  created_at: Date;
  updated_at: Date;
};

export type SubscriptionSelect = Selectable<Subscription>;
export type SubscriptionInsert = Insertable<Subscription>;
export type SubscriptionUpdate = Updateable<Subscription>;

export type BillingAddress = {
  id: UUID;
  user_id: UUID;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
};

export type BillingAddressSelect = Selectable<BillingAddress>;
export type BillingAddressInsert = Insertable<BillingAddress>;
export type BillingAddressUpdate = Updateable<BillingAddress>;

export type ChatConversation = {
  id: UUID;
  user_id: UUID;
  title: string;
  created_at: Date;
  updated_at: Date;
};

export type ChatConversationSelect = Selectable<ChatConversation>;
export type ChatConversationInsert = Insertable<ChatConversation>;
export type ChatConversationUpdate = Updateable<ChatConversation>;

export type ChatMessage = {
  id: UUID;
  conversation_id: UUID;
  role: string;
  content: string;
  created_at: Date;
};

export type ChatMessageSelect = Selectable<ChatMessage>;
export type ChatMessageInsert = Insertable<ChatMessage>;
export type ChatMessageUpdate = Updateable<ChatMessage>;

export type CartItem = {
  id: UUID;
  user_id: UUID;
  service_id: UUID;
  quantity: number;
  created_at: Date;
  updated_at: Date;
};

export type CartItemSelect = Selectable<CartItem>;
export type CartItemInsert = Insertable<CartItem>;
export type CartItemUpdate = Updateable<CartItem>;

export type HeroCarousel = {
  id: UUID;
  title: string;
  description: string;
  image_url: string;
  button_text?: string;
  button_link?: string;
  order: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type HeroCarouselSelect = Selectable<HeroCarousel>;
export type HeroCarouselInsert = Insertable<HeroCarousel>;
export type HeroCarouselUpdate = Updateable<HeroCarousel>;

export type Invoice = {
  id: UUID;
  payment_id: string | null;
  number: string;
  file_url: string;
  created_at: Date;
};

export type InvoiceSelect = Selectable<Invoice>;
export type InvoiceInsert = Insertable<Invoice>;
export type InvoiceUpdate = Updateable<Invoice>;

export type PaymentMethod = {
  id: UUID;
  user_id: UUID | null;
  type: string;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
};

export type PaymentMethodSelect = Selectable<PaymentMethod>;
export type PaymentMethodInsert = Insertable<PaymentMethod>;
export type PaymentMethodUpdate = Updateable<PaymentMethod>;

export type Payment = {
  id: UUID;
  subscription_id: UUID;
  amount: number;
  status: string;
  payment_method: string;
  created_at: Date;
  billing_address_id: string | null;
  payment_method_id: string | null;
};

export type PaymentSelect = Selectable<Payment>;
export type PaymentInsert = Insertable<Payment>;
export type PaymentUpdate = Updateable<Payment>;
