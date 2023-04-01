import {Router} from "express";
import getUser from "../controllers/user/getUser.controller";
import updateUser from "../controllers/user/updateUser.controller";
import {verifyToken} from "../middlewares/authJwt";

const router = Router();

router.get('/user/:id', getUser);
router.put('/user/:id', verifyToken, updateUser);

export default router;