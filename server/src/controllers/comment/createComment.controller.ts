import {Request, Response} from "express";
import Comment from "../../models/Comment";
import {StatusCodes} from "http-status-codes";
import {COMMENT_PREFIX} from "../../helpers/defineConsts";
import randomId from "../../libs/randomId";

const createComment = async (req: Request, res: Response) => {
  
  const { eventId, comment } = req.body
  const { id, username, userImg } = req.user
  
  try {
    
    if (!eventId || !comment)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Missing eventId or comment'
      })
  
    const newComment = await Comment.create({
      id: COMMENT_PREFIX + randomId(),
      comment,
      username,
      userId: id,
      eventId,
      userImg
    });
    
    res.json(newComment)
  
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
  
}

export default createComment;