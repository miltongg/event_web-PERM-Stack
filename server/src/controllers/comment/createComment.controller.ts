import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {COMMENT_PREFIX, EVENT_PREFIX} from "../../helpers/defineConsts";
import randomId from "../../libs/randomId";
import Comment from "../../models/Comment";
import event from "../../models/Event";

const createComment = async (req: Request, res: Response) => {
  const {elementId, comment, rating} = req.body;
  const {id, username, userImg} = req.user;
  
  let newsId: string | null = null;
  let eventId: string | null = null;
  
  elementId.includes(EVENT_PREFIX) ? eventId = elementId : newsId = elementId;
  
  try {
    if (!comment)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Escribe tu comentario",
      });
    
    // Create comment
    const newComment = await Comment.create({
      id: COMMENT_PREFIX + randomId(),
      comment,
      username,
      newsId,
      eventId,
      userId: id,
      userImg,
      rating,
    });
    
    res.json(newComment.dataValues);
    
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export default createComment;
