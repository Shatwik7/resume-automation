import { Router } from "npm:express";
import { Request, Response, NextFunction } from "npm:express";
import {addUrlAndChangeStatus} from '../controllers/webhooks.controller.ts';
const router = Router();

const validateWebhook = (req:Request, res:Response, next:NextFunction) => {
    const webhookSecret = req.headers["webhook-secret"];
    const expectedSecret = Deno.env.get("WEBHOOK_SECRET") || "mywebhookSecret";
    if (webhookSecret !== expectedSecret) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    next();
};

router.post('/resume', validateWebhook, addUrlAndChangeStatus);


export default router;