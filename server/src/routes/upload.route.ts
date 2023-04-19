import {Router} from "express";
import uploadImg from "../controllers/img/uploadImg.controller";
import uploadImgs from "../controllers/img/uploadImgs.controller";
import {verifyToken} from "../middlewares/authJwt";
import getImg from "../controllers/img/getImg.controller";

const router = Router();

router.post('/iupload', verifyToken, uploadImg);
router.post('/iuploads', verifyToken, uploadImgs);

router.get('/uploads/img/:folder/:subfolder/:name', getImg)

export default router;