import {Request, Response} from "express";
import Comment from "../../models/Comment";
import {StatusCodes} from "http-status-codes";

const updateComment = async (req: Request, res: Response) => {

  try {
    const {id} = req.params;
    const {comment, userImg} = req.body;
    
    if (req.user.id !== id)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'No puedes actualizar este comentario'
      })
  
    const updateComment = await Comment.update({comment, userImg}, {
      where: {id}
    })
  
    res.json('Has actualizado tu comentario')
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }

}

export default updateComment;