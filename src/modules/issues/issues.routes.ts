import { Router } from "express";
import verifyToken from "../../middleware/verifyToken";

import {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
} from "./issues.controller";

const router = Router();

router.post("/", verifyToken, createIssue);

router.get("/", getAllIssues);

router.get("/:id", getSingleIssue);

router.patch("/:id", verifyToken, updateIssue);

export default router;