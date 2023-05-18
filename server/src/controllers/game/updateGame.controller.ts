import { Request, Response } from "express";
import Game from "../../models/Game";

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
    res.status(500).json({
      message: error.message,
    });
  }
};

export default updateGame;
