import { Request, Response } from "express";
import Game from "../../models/Game";
import { GAME_PREFIX } from "../../helpers/defineConsts";
import randomId from "../../libs/randomId";
import { StatusCodes } from "http-status-codes";

const addGame = async (req: Request, res: Response) => {
  try {
    const { name, description, answer, image, points, music, date, type } = req.body;

    if (!date || !name || !type)
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Faltan datos por rellenar",
      });

    const newGame = await Game.create({
      id: GAME_PREFIX + randomId(),
      name,
      description,
      image,
      points,
      answer,
      music,
      date,
      type
    });

    res.json(newGame);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error?.message,
    });
  }
};

export default addGame;
