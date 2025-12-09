import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./src/settings/config.js";
import { authRouter } from "./src/routes/auth.routes.js";
import { startConnection } from "./src/settings/database.js";
import { avatarsRouter } from "./src/routes/avatars.routes.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";

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

app.use(errorHandler);

app.use("/api/auth", authRouter);
app.use("/api/avatars", avatarsRouter);

app.listen(config.port, async () => {
  await startConnection({
    uri: config.mongo,
    database: config.database,
  });
  console.log("Server is running on port: http://localhost:" + config.port);
});
