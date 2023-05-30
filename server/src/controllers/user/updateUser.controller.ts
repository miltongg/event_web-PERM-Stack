import { Request, Response } from "express";
import User from "../../models/User";
import { ADMIN_ROLE } from "../../helpers/defineConsts";
import StatusCodes from "http-status-codes";
import { Op } from "sequelize";

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let { name, username, email, cell, socials, userImg, points, gameId } =
      req.body;

    if (req.user.id !== id && req.user.role !== ADMIN_ROLE) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    let role = "";
    let status = "";
    if (req.user.role === ADMIN_ROLE) {
      role = req.body.role as string;
      status = req.body.status as string;
    } else {
      const user = await User.findOne({
        where: { id },
        attributes: ["role", "status"],
      });

      role = user?.dataValues.role;
      status = user?.dataValues.status;
    }

    if (username) {
      const getUsername = await User.findOne({
        where: { username, id: { [Op.not]: id } },
        attributes: ["id"],
      });
      if (getUsername)
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          message: `El alias ${username} ya está en uso`,
        });
    }

    if (points) {
      await User.increment({ points }, { where: { id } });

      // const gameFounded = req.user.gameId.find((id) => id === gameId);

      // if (!gameFounded) {
      //   await User.update(
      //     {
      //       points: sequelize.literal(`points + ${points}`),
      //       gameId: sequelize.fn(
      //         "array_append",
      //         sequelize.col("gameID"),
      //         gameId
      //       ),
      //     },
      //     { where: { id: req.user.id } }
      //   );
      // }
      return res.json({message: "success"});
    }

    await User.update(
      { name, username, email, cell, socials, role, status, userImg },
      {
        where: { id },
      }
    );

    res.json({
      message: "Has actualizado tu perfil satisfactoriamente",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default updateUser;
