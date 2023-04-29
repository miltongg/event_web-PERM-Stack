import { Request, Response } from "express";
import Reply from "../../models/Reply";
import { StatusCodes } from "http-status-codes";
import { REPLY_PREFIX } from "../../helpers/defineConsts";
import randomId from "../../libs/randomId";
import Comment from "../../models/Comment";

const createReply = async (req: Request, res: Response) => {
  const { commentId, reply, repliedToName, repliedToId, elementId } = req.body;
  const { id, username, userImg } = req.user;

  try {
    if (!commentId || !reply)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Missing commentId or reply",
      });

    const newReply = await Reply.create({
      id: REPLY_PREFIX + randomId(),
      reply,
      username,
      userId: id,
      commentId,
      repliedToName,
      elementId,
      repliedToId,
      userImg,
    });

    res.json(newReply.dataValues);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export default createReply;