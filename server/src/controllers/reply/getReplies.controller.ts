import {Response, Request} from "express";
import Reply from "../../models/Reply";
import {StatusCodes} from "http-status-codes";

const getReplies = async (req: Request, res: Response): Promise<Response> => {
  
  try {
    const {id} = req.params;
    
    const replies = await Reply.findAll({
      where: {
        commentId: id
      }
    })
    
    return res.json(replies);
    
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}

export default getReplies;