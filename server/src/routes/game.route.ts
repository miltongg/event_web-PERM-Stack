import { Router } from "express";
import { isAdmin, verifyToken } from "../middlewares/authJwt";
import addGame from "../controllers/game/addGame.controller";
import updateGame from "../controllers/game/updateGame.controller";
import getGamesList from "../controllers/game/getGamesList.controller";
import getGame from "../controllers/game/getGame.controller";

const router = Router();

router.post("/game", verifyToken, isAdmin, addGame);
router.put("/game/:id", verifyToken, isAdmin, updateGame);
router.get("/game", getGamesList);
router.get("/game/:id", getGame);

export default router;
