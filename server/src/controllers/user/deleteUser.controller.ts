import { Request, Response } from "express";
import User from "../../models/User";
import { ADMIN_ROLE } from "../../helpers/defineConsts";
import StatusCodes from "http-status-codes";
import Reply from "../../models/Reply";
import Comment from "../../models/Comment";

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!id)
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ message: "Missing id" });

    if (req.user.id !== id && req.user.role !== ADMIN_ROLE)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });

    await Reply.destroy({ where: { userId: id } });

    await Comment.destroy({ where: { userId: id } });

    await User.destroy({ where: { id } });

    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error: any) {
    console.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export default deleteUser;
