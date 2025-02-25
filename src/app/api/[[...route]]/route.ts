import { api } from "@/api";
import { handle } from "hono/vercel";

export const runtime = "edge";

export const GET = handle(api);
export const POST = handle(api);
export const PUT = handle(api);
export const DELETE = handle(api);
export const PATCH = handle(api);
