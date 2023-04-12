import {Router} from "express";
import {verifyToken} from "../middlewares/authJwt";
import createReply from "../controllers/reply/createReply.controller";
import getReplies from "../controllers/reply/getReplies.controller";
import updateReply from "../controllers/reply/updateReply.controller";


const router = Router();

router.post('/reply', verifyToken, createReply);
router.get('/reply/:id', getReplies);
router.put('/reply/:id', verifyToken, updateReply);

export default router;