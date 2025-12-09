import { Router } from "express";
import { ctrlListAllAvatars } from "../controllers/avatars-controllers.js";

const avatarsRouter = Router();

avatarsRouter.get("/", ctrlListAllAvatars);

export { avatarsRouter };
