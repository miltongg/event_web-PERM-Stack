import { Request, Response } from "express";
import Game from "../../models/Game";
import { StatusCodes } from "http-status-codes";
import moment from "moment";

const updateGame = async (req: Request, res: Response) => {
  try {
    let { name, description, date, image, answerImage, points, views, rating } = req.body;

    const { id } = req.params;    

    const game = await Game.update(
      {
        name,
        description,
        date,
        image,
        answerImage,
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
