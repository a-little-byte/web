import type { UUID } from "node:crypto";
import { z } from "zod";

export const idValidator = z
  .string()
  .uuid()
  .transform((val) => val as UUID);

export const emailValidator = z.string().email();
