import { Request, Response } from "express";
import Reply from "../../models/Reply";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

const updateReply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params ? req.params : req.headers;
    const { reply, userImg, username, repliedToName } = req.body;

    console.log(req.body);

    await Reply.update(
      { userImg, reply, username, repliedToName },
      {
        where: {
          [Op.or]: [{repliedToId: id}, { userId: id }, { id }],
        },
      }
    );

    res.json("Has actualizado tu respuesta");
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export default updateReply;
