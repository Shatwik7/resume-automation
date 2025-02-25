import { Request, Response, NextFunction } from "npm:express";
import User from "../models/user.model.ts";
import { signInSchema, signUpSchema } from "../schemas/user.schema.ts";
import { checkPassword, createToken, hashPassword } from "../helper/auth.ts";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data=signUpSchema.parse(req.body);
    const user = new User({...data,hashPassword:hashPassword(data.password)});
    const savedUser = await user.save();
    const token=createToken(savedUser.id);
    res.cookie("token", token, {
      httpOnly: true, 
      secure: Deno.env.get("DENO_ENV") === "production", 
      signed: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    });
    res.status(201).json({message: "Sign-in successful",user:savedUser,token});
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const signInUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier, password } = signInSchema.parse(req.body);

    const user = await User.findOne({
      $or: [{ email: identifier }, { phno: identifier }],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = checkPassword(password, user.hashPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token=createToken(user.id);
    res.cookie("token", token, {
      httpOnly: true, 
      secure: Deno.env.get("DENO_ENV") === "production", 
      signed: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 1),
    });
    res.status(200).json({ message: "Sign-in successful", user , token});
  } catch (error) {
    next(error);
  }
};