import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  ctrlCreatedCard,
  ctrlDeleteCard,
  ctrlGetCard,
  ctrlGetCardsByList,
  ctrlUpdateCard,
} from "../controllers/card.controllers";
import {
  validateCardId,
  validateCreateCard,
  validateUpdateCard,
} from "../validations/card.validations";

const cardsRouter = Router();

cardsRouter.post("/", verifyToken, validateCreateCard, ctrlCreatedCard);
cardsRouter.get("/:id", verifyToken, validateCardId, ctrlGetCard);
cardsRouter.get("/list/:listId", verifyToken, ctrlGetCardsByList);
cardsRouter.patch(
  "/:id",
  verifyToken,
  validateCardId,
  validateUpdateCard,
  ctrlUpdateCard
);
cardsRouter.delete("/:id", verifyToken, validateCardId, ctrlDeleteCard);

export { cardsRouter };
