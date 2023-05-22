import { Request, Response } from "express";
import News from "../../models/News";
import sequelize from "sequelize";
import Comment from "../../models/Comment";

const getNewsList = async (req: Request, res: Response) => {
  try {
    let limit = req.headers.limit as number | undefined;
    let offset = req.headers.offset as number | undefined;

    if (!limit) limit = 10;

    if (!offset) offset = 0;

    const newsList = await News.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "comments" AS "Comment" WHERE "Comment"."newsId" = "News"."id") + (SELECT COUNT(*) FROM "replies" AS "Reply" JOIN "comments" AS "Comment" ON "Reply"."commentId" = "Comment"."id" WHERE "Comment"."newsId" = "News"."id")`
            ),
            "commentsCount",
          ],
        ],
      },
      include: [
        {
          model: Comment,
          as: "Comments",
          attributes: [],
        },
      ],
      subQuery: false,
      group: ["News.id"],
      order: [["date", "DESC"]],
      limit,
      offset,
    });

    const count = await News.count();

    res.json({ newsList, count });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error?.message,
    });
  }
};

export default getNewsList;
