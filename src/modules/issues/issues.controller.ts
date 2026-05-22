import { Response } from "express";
import { AuthRequest } from "../../middleware/verifyToken";
import { createIssueIntoDB } from "./issues.service";

export const createIssue = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    const result = await createIssueIntoDB(
      req.body,
      userId as number
    );

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
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