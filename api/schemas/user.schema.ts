import { z } from "npm:zod";

// Define the schema
export const signInSchema = z.object({
  identifier: z.union([
    z.string().email("Invalid email address"),
    z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  ]),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const educationSchema = z.object({
  college_name: z.string(),
  major: z.string(),
  starting: z.string(),
  gpa:z.number(),
  ending: z.string().optional(),
});

// Sign-up schema
export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phno: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits").optional(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  city: z.string().optional(),
  email: z.string().email("Invalid email address"),
  linkdin: z.string().url("Invalid LinkedIn URL").optional(),
  github: z.string().url("Invalid GitHub URL").optional(),
  education: z.array(educationSchema).optional(),
  resumes: z.array(z.string()).optional(),
});