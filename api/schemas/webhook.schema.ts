import { z } from "npm:zod";

export const addUrlAndChangeStatusSchema = z.object({
    url:z.string(),
    resumeId:z.string(),
    status: z.enum(["pending", "processing", "completed", "failed"]).default("completed"),
});
