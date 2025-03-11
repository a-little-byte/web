import { apiConfig } from "@/api/config";
import Stripe from "stripe";

export const stripe = new Stripe(apiConfig.stripeSecretKey);
