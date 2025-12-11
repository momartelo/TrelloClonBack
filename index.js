import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { authRouter } from "./src/routes/auth.routes.js";
import { avatarsRouter } from "./src/routes/avatars.routes.js";
import { boardsRouter } from "./src/routes/boards.routes.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import { listsRouter } from "./src/routes/lists.routes.js";
import { cardsRouter } from "./src/routes/cards.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(morgan("dev"));

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
export const publicPath = path.join(_dirname, "public");
app.use(express.static(publicPath));

app.get("/", (req, res) => res.send("API funcionando"));

app.use("/api/auth", authRouter);
app.use("/api/avatars", avatarsRouter);
app.use("/api/boards", boardsRouter);
app.use("/api/lists", listsRouter);
app.use("/api/cards", cardsRouter);

app.use(errorHandler);

export { app };
