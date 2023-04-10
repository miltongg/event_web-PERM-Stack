import {Router} from "express";
import {verifyToken} from "../middlewares/authJwt";
import createReply from "../controllers/reply/createReply.controller";


const router = Router();

router.post('/comment', verifyToken, createReply);

export default router;