import { Router } from "express";

import {
  addMember,
  createBoard,
  deleteBoard,
  getBoardById,
  getBoards,
  removeMember,
  updateBoard,
} from "../controllers/board.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  validateBoardId,
  validateCreateBoard,
  validateMemberEmail,
  validateUpdateBoard,
} from "../validations/board.validations.js";

const boardsRouter = Router();

boardsRouter.get("/", verifyToken, getBoards);
boardsRouter.post("/", verifyToken, validateCreateBoard, createBoard);
boardsRouter.get("/:id", verifyToken, validateBoardId, getBoardById);
boardsRouter.patch(
  "/:id",
  verifyToken,
  validateBoardId,
  validateUpdateBoard,
  updateBoard
);
boardsRouter.delete("/:id", verifyToken, validateBoardId, deleteBoard);

boardsRouter.patch(
  "/:id/members/add",
  verifyToken,
  validateBoardId,
  validateMemberEmail,
  addMember
);
boardsRouter.patch(
  "/:id/members/remove",
  verifyToken,
  validateBoardId,
  validateMemberEmail,
  removeMember
);

export { boardsRouter };
