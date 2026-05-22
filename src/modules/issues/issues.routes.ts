import { Router } from "express";
import verifyToken from "../../middleware/verifyToken";
import verifyRole from "../../middleware/verifyRole";

import {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
} from "./issues.controller";

const router = Router();

router.post("/", verifyToken, createIssue);

router.get("/", getAllIssues);

router.get("/:id", getSingleIssue);

router.patch("/:id", verifyToken, updateIssue);

router.delete(
  "/:id",
  verifyToken,
  verifyRole("maintainer"),
  deleteIssue
);

export default router;