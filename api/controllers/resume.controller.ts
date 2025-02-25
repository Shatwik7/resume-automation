import { Request, Response, NextFunction } from "npm:express";
import Resume from "../models/resume.model.ts";
import Queue from "../redis.ts";
import User from "../models/user.model.ts";
import { resumeCreateSchema } from "../schemas/resume.schema.ts";
import Template from "../models/template.model.ts";

const SERVER_URL = Deno.env.get("SERVER_URL") || "http://localhost:3000";

export const createResume = async (req: Request, res: Response, 
  next: NextFunction) => {
  try {
    const data=resumeCreateSchema.parse(req.body);
    console.log(req.userId);
    const resume = new Resume({
      user:req.userId,
      selected_repo:data.selected_repo,
      template:data.template_id
    });
    await resume.save();
    const user=await User.findByIdAndUpdate(req.userId, { $push: { resumes: resume._id } },{new:true});
    const template=await Template.findById(data.template_id);
    if(!template||!user){
      res.status(404).json({ message: "template not found" });
    }
    await  Queue.enqueue({
      user,
      resume,
      template,
      distUrl:`${SERVER_URL}/api/webhooks/resume`
    });
    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
};

export const getResumes = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    
    const resumes = await Resume.find();
    res.json(resumes);
  } catch (error) {
    next(error);
  }
};

export const getResumeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  } catch (error) {
    next(error);
  }
};

export const updateResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resume = await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    next(error);
  }
};
