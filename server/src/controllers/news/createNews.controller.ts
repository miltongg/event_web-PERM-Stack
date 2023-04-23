import {Request, Response} from "express";
import News from "../../models/News";
import randomId from "../../libs/randomId";
import {StatusCodes} from "http-status-codes";
import {NEWS_PREFIX} from "../../helpers/defineConsts";
import unidecode from "unidecode";

const createNews = async (req: Request, res: Response) => {
  try {
    const {name, date, description, tag, subtitle} = req.body;
    const {id} = req.headers;
    
    const news = await News.create({
      id: NEWS_PREFIX + randomId(),
      userId: id,
      name,
      subtitle,
      tag,
      slug: unidecode(name).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase(),
      date,
      description,
    });
    
    res.json(news);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error?.message,
    });
  }
};

export default createNews;
