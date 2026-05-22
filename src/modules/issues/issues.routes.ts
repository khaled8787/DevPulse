import { Router } from "express";
import verifyToken from "../../middleware/verifyToken";

import {
  createIssue,
  getAllIssues,
} from "./issues.controller";

const router = Router();

router.post("/", verifyToken, createIssue);

router.get("/", getAllIssues);

export default router;