import { Router } from "express";
import verifyToken from "../../middleware/verifyToken";
import { createIssue } from "./issues.controller";

const router = Router();

router.post("/", verifyToken, createIssue);

export default router;