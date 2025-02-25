import { Request, Response, NextFunction } from "npm:express";
import { z, type ZodError } from "npm:zod";


export const zodErrorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    const errors = error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    res.status(400).json({ errors });
  } else {
    next(error);
  }
};