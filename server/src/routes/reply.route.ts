import {Router} from "express";
import {verifyToken} from "../middlewares/authJwt";
import createReply from "../controllers/reply/createReply.controller";
import getReplies from "../controllers/reply/getReplies.controller";


const router = Router();

router.post('/reply', verifyToken, createReply);
router.get('/reply/:id', getReplies);

export default router;