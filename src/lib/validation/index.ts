import * as z from "zod";

export const SignupForm = z.object({
  name: z.string().min(2, { message: "Too Short" }),
  username: z.string().min(2, { message: "Too Short" }).max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});
export const SigninForm = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});
export const PostValidate = z.object({
  caption: z.string().min(3).max(2200),
  location: z.string().min(10).max(100),
  tags: z.string().min(5).max(100),
  file: z.custom<File[]>(),
});
