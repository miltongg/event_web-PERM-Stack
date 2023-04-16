import { Request, Response } from "express";
import Comment from "../../models/Comment";
import { StatusCodes } from "http-status-codes";
import Reply from "../../models/Reply";

const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Comment.destroy({ where: { id } });

    await Reply.destroy({ where: { commentId: id } });

    res.json("Has borrado tu comentario");
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export default deleteComment;
