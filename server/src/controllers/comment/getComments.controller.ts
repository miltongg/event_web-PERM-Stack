import {Response, Request} from "express";
import Comment from "../../models/Comment";
import {StatusCodes} from "http-status-codes";
import {EVENT_PREFIX} from "../../helpers/defineConsts";
import sequelize, {Op} from 'sequelize';
import Reply from "../../models/Reply";

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
      },
      
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('Replies.id')), 'repliesCount']
        ]
      },
      
      include: [
        {
          model: Reply,
          as: 'Replies',
          attributes: []
        }
      ],
      group: ['Comment.id'],
    })
    
    return res.json(comments);
    
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}

export default getComments;