import { Request, Response } from "express";
import Game from "../../models/Game";
import { StatusCodes } from "http-status-codes";

const updateGame = async (req: Request, res: Response) => {
  try {
    const { name, description, date, image, points, views, rating } = req.body;

    const { id } = req.params;

    const game = await Game.update(
      {
        name,
        description,
        date,
        image,
        points,
        views,
        rating,
      },
      { where: { id } }
    );

    res.json(game);
  } catch (error: any) {
    console.error(error?.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export default updateGame;
