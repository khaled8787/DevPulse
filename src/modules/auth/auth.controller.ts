import { Request, Response } from "express";
import { signupUser } from "./auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await signupUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};