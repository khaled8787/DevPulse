import { Router } from "express";
import verifyToken from "../../middleware/verifyToken";

import {
  createIssue,
  getAllIssues,
  getSingleIssue,
} from "./issues.controller";

const router = Router();

router.post("/", verifyToken, createIssue);

router.get("/", getAllIssues);

router.get("/:id", getSingleIssue);

export default router;