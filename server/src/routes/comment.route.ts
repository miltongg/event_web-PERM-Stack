import {Router} from "express";
import {verifyToken} from "../middlewares/authJwt";
import createComment from "../controllers/comment/createComment.controller";
import getComments from "../controllers/comment/getComments.controller";
import updateComment from "../controllers/comment/updateComment.controller";
import deleteComment from "../controllers/comment/deleteComment.controller";


const router = Router();

router.post('/comment', verifyToken, createComment);
router.get('/comment/:id', getComments);
router.put('/comment/:id', verifyToken, updateComment);
router.delete('/comment/:id', verifyToken, deleteComment);

export default router;