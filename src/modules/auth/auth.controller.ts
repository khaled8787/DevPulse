import { Request, Response } from "express";
import { signupUser, loginUser } from "./auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await signupUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    const err = error as Error;

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const err = error as Error;

    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};