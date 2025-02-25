import { Router } from "npm:express";
import multer from "npm:multer";
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from "../controllers/template.controller.ts";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post("/",upload.fields([{ name: "ejsFile" }, { name: "imageFile" }]), createTemplate);
router.get("/", getTemplates);
router.get("/:id", getTemplateById);
router.put("/:id",upload.fields([{ name: "ejsFile" }, { name: "imageFile" }]), updateTemplate);
router.delete("/:id", deleteTemplate);

export default router;
