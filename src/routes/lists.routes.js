import { Router } from "express";
import {
  ctrlCreateList,
  ctrlDeleteList,
  ctrlGetList,
  ctrlGetListByBoard,
  ctrlUpdateList,
} from "../controllers/list.controllers.js";
import {
  validateCreateList,
  validateListId,
  validateUpdateList,
} from "../validations/list.validations.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const listsRouter = Router();

listsRouter.post("/", verifyToken, validateCreateList, ctrlCreateList);
listsRouter.get("/:id", verifyToken, validateListId, ctrlGetList);
listsRouter.get("/board/:id", verifyToken, ctrlGetListByBoard);
listsRouter.patch(
  "/:id",
  verifyToken,
  validateListId,
  validateUpdateList,
  ctrlUpdateList
);
listsRouter.delete("/:id", verifyToken, validateListId, ctrlDeleteList);

export { listsRouter };
