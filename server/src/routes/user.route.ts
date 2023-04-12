import {Router} from "express";
import {verifyToken} from "../middlewares/authJwt";
import getUsers from "../controllers/user/getUsers.controller";
import getUser from "../controllers/user/getUser.controller";
import updateUser from "../controllers/user/updateUser.controller";

const router = Router();

router.get('/user/:id', getUser);
router.get('/users', getUsers)
router.put('/user/:id', verifyToken, updateUser);

export default router;