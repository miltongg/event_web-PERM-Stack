import {Router} from "express";
import {verifyToken} from "../middlewares/authJwt";
import createComment from "../controllers/comment/createComment.controller";


const router = Router();

router.post('/comment', verifyToken, createComment);

export default router;