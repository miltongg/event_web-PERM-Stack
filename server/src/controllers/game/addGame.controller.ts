import { Request, Response } from "express";
import Game from "../../models/Game";
import { GAME_PREFIX } from "../../helpers/defineConsts";
import randomId from "../../libs/randomId";
import { StatusCodes } from "http-status-codes";

const addGame = async (req: Request, res: Response) => {
  try {
    const { name, description, image, music, date, type } = req.body;

    console.log(req.body);

    const newGame = await Game.create({
      id: GAME_PREFIX + randomId(),
      name,
      description,
      image,
      music,
      date,
      type,
    });

    res.json(newGame);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error?.message,
    });
  }
};

export default addGame;
