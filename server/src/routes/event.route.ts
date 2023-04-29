import { Router } from "express";
import { isAdmin, verifyToken } from "../middlewares/authJwt";
import createEvent from "../controllers/event/createEvent.controller";
import updateEvent from "../controllers/event/updateEvent.controller";
import getEventsList from "../controllers/event/getEventsList.controller";
import getEvent from "../controllers/event/getEvent.controller";
import deleteEvent from "../controllers/event/deleteEvent.controller";

const router = Router();

router.post("/event", verifyToken, isAdmin, createEvent);
router.get("/event", getEventsList);
router.get("/event/:slug", getEvent);
router.put("/event/:slug", verifyToken, isAdmin, updateEvent);
router.delete("/event/:id", verifyToken, isAdmin, deleteEvent);

export default router;
