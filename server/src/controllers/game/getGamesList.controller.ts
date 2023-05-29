import { Request, Response } from "express";
import sequelize from "sequelize";
import Comment from "../../models/Comment";
import StatusCodes from "http-status-codes";
import Game from "../../models/Game";

const getGamesList = async (req: Request, res: Response) => {
  try {
    let limit = (req.headers.limit as string) || 10;
    let offset = (req.headers.offset as string) || 0;

    if (typeof limit === "string") limit = Number(limit);
    if (typeof offset === "string") offset = Number(offset);

    const gamesList = await Game.findAll({
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
      subQuery: false,
      group: ["Game.id"],
      order: [["date", "DESC"]],
      limit,
      offset,
    });

    const count = await Game.count();

    res.json({ gamesList, count });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error?.message,
    });
  }
};

export default getGamesList;
