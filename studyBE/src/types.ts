import { z } from "zod";

export const signupType = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string()
})

export const signinType = z.object({
  email: z.string().email(),
  password: z.string()
})

