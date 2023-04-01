import {Router} from "express";
import {isAdmin, verifyToken} from "../middlewares/authJwt";
import createEvent from "../controllers/event/createEvent.controller";
import updateEvent from "../controllers/event/updateEvent.controller";
import getEventsList from "../controllers/event/getEventsList.controller";
import getEvent from "../controllers/event/getEvent.controller";

const router = Router();

router.post('/event', verifyToken, isAdmin, createEvent);
router.get('/event', getEventsList);
router.get('/event/:id', getEvent);
router.put('/event/:id', verifyToken, isAdmin, updateEvent);

export default router;