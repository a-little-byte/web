import { apiConfig } from "@/api/config";
import { Resend } from "resend";

export const resend = new Resend(apiConfig.resendApiKey);
