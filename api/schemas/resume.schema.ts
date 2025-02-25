import { z } from "npm:zod";

export const resumeCreateSchema = z.object({
    selected_repo:z.array(z.string().min(1, "Strings cannot be empty")).min(2).max(4),
    template_id:z.string(),
});
