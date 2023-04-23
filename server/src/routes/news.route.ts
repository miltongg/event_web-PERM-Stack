import {Router} from "express";
import {isAdmin, verifyToken} from "../middlewares/authJwt";
import createNews from "../controllers/news/createNews.controller";
import updateNews from "../controllers/news/updateNews.controller";
import getNews from "../controllers/news/getNews.controller";
import getNewsList from "../controllers/news/getNewsList.controller";

const router = Router();

router.post('/news', verifyToken, isAdmin, createNews);
router.get('/news', getNewsList);
router.get('/news/:slug', getNews);
router.put('/news/:slug', verifyToken, updateNews);

export default router;