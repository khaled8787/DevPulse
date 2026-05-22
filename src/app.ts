import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import verifyToken from "./middleware/verifyToken";
import issuesRoutes from "./modules/issues/issues.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed",
  });
});
app.use("/api/issues", issuesRoutes);

app.get("/", (req, res) => {
  res.send("DevPulse API Running...");
});

export default app;