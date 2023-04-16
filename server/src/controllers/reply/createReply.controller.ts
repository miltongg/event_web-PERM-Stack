import {Request, Response} from "express";
import Reply from "../../models/Reply";
import {StatusCodes} from "http-status-codes";
import {REPLY_PREFIX} from "../../helpers/defineConsts";
import randomId from "../../libs/randomId";
import Comment from "../../models/Comment";

const createReply = async (req: Request, res: Response) => {
  
  const { commentId, reply, repliedToName, repliedToId } = req.body
  const { id, username, userImg } = req.user
  
  console.log(req.body)
  
  try {
    
    if (!commentId || !reply)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Missing commentId or reply'
      })
  
    const newReply = await Reply.create({
      id: REPLY_PREFIX + randomId(),
      reply,
      username,
      userId: id,
      commentId,
      repliedToName,
      repliedToId,
      userImg
    });

    await Comment.increment('repliesCount', {where: {id: commentId}})
      
    res.json(newReply)
  
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
  
}

export default createReply;