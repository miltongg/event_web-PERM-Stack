import { Request, Response } from "express";
import Game from "../../models/Game";
import { StatusCodes } from "http-status-codes";
import { ADMIN_ROLE, MODERATOR_ROLE } from "../../helpers/defineConsts";

const updateGame = async (req: Request, res: Response): Promise<void> => {
  try {
    let {
      name,
      description,
      date,
      image,
      answerImage,
      points,
      views,
      rating,
      usersId,
    } = req.body;

    const { id } = req.params;

    console.log(usersId);
    

    let game;

    !usersId
      ? (game = await Game.update(
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
        ))
      : (game = await Game.update(
          {
            usersId: [...usersId, req.user.id],
          },
          { where: { id } }
        ));

    res.json(game);
  } catch (error: any) {
    console.error(error?.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export default updateGame;
