import express from "express";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";


import authRoutes from "./routes/auth.routes";


import config from "./config";
import path from "path";
const app = express();

app.set("port", config.PORT);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secree",
    name: "sessionId",
    cookie: {
      httpOnly: false,
    },
  })
);

app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api/auth", authRoutes);

export default app;
