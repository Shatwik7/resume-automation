import { Router } from "npm:express";
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  signInUser,
} from "../controllers/user.controller.ts";
import { authorization } from "../helper/auth.ts";

const router = Router();

router.post("/signup", createUser);
router.post("/signin",signInUser);
router.get("/me", authorization,getUserById);
router.put("/me",authorization, updateUser);
router.delete("/me",authorization, deleteUser);

export default router;
