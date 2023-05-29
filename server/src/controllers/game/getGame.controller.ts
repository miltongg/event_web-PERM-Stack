import { Request, Response } from "express";
import Game from "../../models/Game";
import StatusCodes from "http-status-codes";
import Event from "../../models/Event";
import sequelize from "sequelize";
import Comment from "../../models/Comment";

const getGame = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await Game.increment("views", { where: { id } });

    const game = await Game.findOne({
      where: { id },
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "comments" AS "Comment" WHERE "Comment"."gameId" = "Game"."id")`
            ),
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
      group: ["Game.id"],
    });

    if (!game)
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Game not found",
      });

    res.json(game);
  } catch (error: any) {
    console.error(error?.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export default getGame;
