import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import verifyToken from "./middleware/verifyToken";

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

app.get("/", (req, res) => {
  res.send("DevPulse API Running...");
});

export default app;