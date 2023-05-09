import {Request, Response} from "express";
import Comment from "../../models/Comment";
import {StatusCodes} from "http-status-codes";
import sequelize from "sequelize";
import News from "../../models/News";

const getNews = async (req: Request, res: Response) => {
  const {slug} = req.params;
  
  try {
    
    const id = (await News.findOne({where: {slug}, attributes: ['id']}))?.id;
    
    if (!id)
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Noticia no encontrada'
      })
    
    const news = await News.findOne({
      where: {id},
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", sequelize.col("Comments.id")),
            "commentsCount",
          ],
          [sequelize.fn("AVG", sequelize.col("Comments.rating")), "rating"],
        ],
      },
      include: [
        {
          model: Comment,
          as: "Comments",
          attributes: [],
        },
      ],
      group: ["News.id"],
    });
    
    if (!news)
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Noticia no encontrada"
      })
    
    await News.increment('views', {where: {slug}})
    
    !news.views ? news.views = 1 : news.views + 1
    
    res.json(news);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error?.message,
    });
  }
};

export default getNews;
