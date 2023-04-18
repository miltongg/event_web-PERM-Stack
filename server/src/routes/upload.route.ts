import {Router} from "express";
import uploadImg from "../controllers/img/uploadImg.controller";
import {verifyToken} from "../middlewares/authJwt";
import getImg from "../controllers/img/getImg.controller";

const router = Router();

router.post('/iupload', verifyToken, uploadImg);

router.get('/uploads/img/:folder/:subfolder/:id', getImg)

export default router;