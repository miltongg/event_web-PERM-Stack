import {Response, Request} from "express";
import Comment from "../../models/Comment";
import {StatusCodes} from "http-status-codes";
import comment from "../../models/Comment";


const getComments = async (req: Request, res: Response): Promise<Response> => {
  
  try {
    const {id} = req.params;
    
    const comments = await Comment.findAll({
      where: {
        eventId: id
      }
    })
    
    return res.json(comments);
    
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}

export default getComments;