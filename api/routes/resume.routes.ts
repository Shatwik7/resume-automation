import { Router } from "npm:express";
import {
  createResume,
  getResumeById,
  updateResume,
  deleteResume,
} from "../controllers/resume.controller.ts";
import { authorization } from "../helper/auth.ts";
import { getResumes } from "../controllers/resume.controller.ts";

const router = Router();

router.post("/", authorization ,createResume);
router.get("/id", getResumeById);
router.get("/",authorization,getResumes);
router.put("/:id",authorization, updateResume);
router.delete("/:id",authorization, deleteResume);

export default router;
