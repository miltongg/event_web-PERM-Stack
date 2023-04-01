import {Router} from "express";
import signin from "../controllers/auth/signin.controller";
import signup from "../controllers/auth/signup.controller";
import signout from "../controllers/auth/signout.controller";
import verify from "../controllers/auth/verify.controller";
import forgotPassword from "../controllers/auth/forgotPassword.controller";
import getLoggedUser from "../controllers/user/getLogedUser";

const router = Router();

router.post('/signup', signup);
router.post('/verify', verify);
router.post('/signin', signin);
router.post('/signout', signout)
router.post('/forgot', forgotPassword);
router.get('/token', getLoggedUser);

export default router;