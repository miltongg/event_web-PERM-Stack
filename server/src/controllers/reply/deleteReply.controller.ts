import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Reply from "../../models/Reply";
import Comment from "../../models/Comment";

const deleteReply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reply = await Reply.findOne({where: {id}})

    await Reply.destroy({ where: { id } });

    await Comment.decrement('repliesCount', {where: {id: reply?.dataValues.commentId}})

    res.json("Has borrado tu respuesta");
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export default deleteReply;
