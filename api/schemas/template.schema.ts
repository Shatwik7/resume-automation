import { z } from "npm:zod";

export const templateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  file_name: z.string().min(1, "File name is required"),
  url: z.string().url("Invalid URL"),
  image_url: z.string().url("Invalid image URL"),
  status: z.enum(["pending", "processing", "completed", "failed"]).default("pending"),
});
