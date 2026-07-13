import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import levelTestRoutes from "./routes/levelTest";
import homeRoutes from "./routes/home";
import speakingRoutes from "./routes/speaking";
import expressionRoutes from "./routes/expressions";
import progressRoutes from "./routes/progress";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "accent-tutor-api" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/level-test", levelTestRoutes);
app.use("/home", homeRoutes);
app.use("/speaking", speakingRoutes);
app.use("/expressions", expressionRoutes);
app.use("/progress", progressRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`accent-tutor-api listening on http://localhost:${PORT}`);
});

export default app;
