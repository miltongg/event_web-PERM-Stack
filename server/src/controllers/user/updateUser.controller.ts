import { Request, Response } from "express";
import User from "../../models/User";
import { ADMIN_ROLE } from "../../helpers/defineConsts";

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let { name, username, email, cell, socials, userImg } = req.body;

    if (req.user.id !== id && req.user.role !== ADMIN_ROLE) {
      console.log("User not found");
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

    await User.update(
      { name, username, email, cell, role, status, socials, userImg },
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
