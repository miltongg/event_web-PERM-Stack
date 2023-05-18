import { Request, Response } from "express";
import Game from "../../models/Game";
import StatusCodes from "http-status-codes";

const getGame = async (req: Request, res: Response) => {
  try {
    const id = req.headers.id as string;

    const game = await Game.findOne({
      where: { id },
    });

    if (!game)
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Game not found",
      });

    res.send(game.dataValues);
  } catch (error: any) {
    console.error(error?.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export default getGame;
