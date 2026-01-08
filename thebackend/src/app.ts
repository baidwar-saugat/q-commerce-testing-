import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import { globalErrorHandler } from "./middlewares/error.middleware";

const app = express();
app.use(helmet());
// app.use(cors());
// ✅ CRITICAL: Allow Frontend to talk to Backend
app.use(
  cors({
    origin: "http://localhost:5173", // Allow your dashboard
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/v1", routes);
app.use(globalErrorHandler);

export default app;
