import { Router } from "express";
import { verifyToken } from "../middlewares/authJwt";
import getUsers from "../controllers/user/getUsers.controller";
import getUser from "../controllers/user/getUser.controller";
import updateUser from "../controllers/user/updateUser.controller";
import deleteUser from "../controllers/user/deleteUser.controller";

const router = Router();

router.get("/user/:id", getUser);
router.get("/users", getUsers);
router.put("/user/:id", verifyToken, updateUser);
router.delete("/user/:id", verifyToken, deleteUser);

export default router;