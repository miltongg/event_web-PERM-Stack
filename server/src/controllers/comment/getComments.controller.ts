import {Response, Request} from "express";
import Comment from "../../models/Comment";
import {StatusCodes} from "http-status-codes";
import {EVENT_PREFIX} from "../../helpers/defineConsts";
import {Op} from 'sequelize';

const getComments = async (req: Request, res: Response): Promise<Response> => {
  
  try {
    const {id} = req.params;
    
    let newsId: string | null = null;
    let eventId: string | null = null;
    
    id.includes(EVENT_PREFIX) ? eventId = id : newsId = id
    
    // Get comments
    const comments = await Comment.findAll({
      where: {
        [Op.and]: [
          {newsId},
          {eventId}
        ]
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