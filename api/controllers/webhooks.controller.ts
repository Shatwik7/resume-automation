import { Request, Response, NextFunction } from "npm:express";
import Resume from "../models/resume.model.ts";
import { addUrlAndChangeStatusSchema } from "../schemas/webhook.schema.ts";


export const addUrlAndChangeStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data=addUrlAndChangeStatusSchema.parse(req.body);
    const resume = await Resume.findByIdAndUpdate(data.resumeId, {status:data.status,url:data.url}, { new: true });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.status(200).json({message:"resume created"});
  } catch (error) {
    next(error);
  }
};

