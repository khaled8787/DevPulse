import { Response } from "express";
import { AuthRequest } from "../../middleware/verifyToken";
import { createIssueIntoDB } from "./issues.service";
import { Request } from "express";
import { getAllIssuesFromDB } from "./issues.service";
import { getSingleIssueFromDB } from "./issues.service";
import { updateIssueIntoDB } from "./issues.service";
import { deleteIssueFromDB } from "./issues.service";

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

export const getAllIssues = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getAllIssuesFromDB(req.query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const err = error as Error;

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getSingleIssue = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getSingleIssueFromDB(
      Number(req.params.id)
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const err = error as Error;

    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};


export const updateIssue = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const issueId = Number(req.params.id);

    const user = req.user;

    const result = await updateIssueIntoDB(
      issueId,
      req.body,
      user!
    );

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error) {
    const err = error as Error;

    res.status(403).json({
      success: false,
      message: err.message,
    });
  }
};


export const deleteIssue = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const issueId = Number(req.params.id);

    await deleteIssueFromDB(issueId);

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    const err = error as Error;

    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};