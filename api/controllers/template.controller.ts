import { Request, Response, NextFunction } from "npm:express";
import Template from "../models/template.model.ts";
import { uploadToS3,deleteFromS3 } from "../util/s3.helper.ts";

export const createTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ensure files are uploaded
    if (!req.files || !("ejsFile" in req.files) || !("imageFile" in req.files)) {
      return res.status(400).json({ error: "EJS template and preview image are required." });
    }

    const bucketName = Deno.env.get("AWS_S3_BUCKET")!;
    
    // Extract uploaded files from Multer
    const ejsFile = req.files["ejsFile"][0];
    const imageFile = req.files["imageFile"][0];

    const [ejsUrl, imageUrl] = await Promise.all(
      [
        uploadToS3(bucketName, `templates/${ejsFile.originalname}-${Date.now()}`, ejsFile.buffer, "text/plain"),
        uploadToS3(bucketName, `templates/previews/${imageFile.originalname}-${Date.now()}`, imageFile.buffer, "image/png")
      ]);
    const template = new Template({
      title: req.body.title,
      file_name: ejsFile.originalname,
      url: ejsUrl,
      image_url: imageUrl,
    });

    const savedTemplate = await template.save();
    res.status(201).json(savedTemplate);
  } catch (error) {
    next(error);
  }
};

export const getTemplates = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (error) {
    next(error);
  }
};

export const getTemplateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: "Template not found" });
    res.json(template);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing template, including optional file updates.
 */
export const updateTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body;
    const ejsFile = req.files?.ejsFile;
    const imageFile = req.files?.imageFile;
    const bucketName = Deno.env.get("AWS_S3_BUCKET")||"";

    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: "Template not found" });

    let ejsUrl = template.url;
    let imageUrl = template.image_url;

    // Upload new EJS file if provided
    if (ejsFile) {
      const ejsKey = `templates/${ejsFile.originalname}-${Date.now()}`;
      ejsUrl = await uploadToS3(bucketName, ejsKey, ejsFile.buffer, "text/plain");
      await deleteFromS3(bucketName, new URL(template.url).pathname.substring(1)); // Remove old file
    }

    // Upload new Image file if provided
    if (imageFile) {
      const imageKey = `templates/previews/${imageFile.originalname}-${Date.now()}`;
      imageUrl = await uploadToS3(bucketName, imageKey, imageFile.buffer, "image/png");
      await deleteFromS3(bucketName, new URL(template.image_url || " ").pathname.substring(1)); // Remove old file
    }

    // Update MongoDB
    const updatedTemplate = await Template.findByIdAndUpdate(
      req.params.id,
      { title, url: ejsUrl, image_url: imageUrl },
      { new: true, runValidators: true }
    );

    res.json(updatedTemplate);
  } catch (error) {
    console.error("❌ Error updating template:", error);
    next(error);
  }
};
export const deleteTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bucketName = Deno.env.get("AWS_S3_BUCKET")!;
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({ message: "Template not found" });
    await Promise.all([
      deleteFromS3(bucketName, new URL(template.url).pathname.substring(1)),
      deleteFromS3(bucketName, new URL(template.image_url).pathname.substring(1))
    ]);
    res.json({ message: "Template deleted successfully" });
  } catch (error) {
    next(error);
  }
};
