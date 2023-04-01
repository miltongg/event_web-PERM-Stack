import {Router} from "express";
import mailSenderController from "../controllers/mailSender.controller";

const router = Router()

router.post('/mail', mailSenderController);

export default router;