import {Request, Response} from "express";
import Comment from "../../models/Comment";
import {StatusCodes} from "http-status-codes";

const deleteComment = async (req: Request, res: Response) => {
  
  try {
    const {id} = req.params;
    
    if (req.user.id !== id)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'No puedes borrar este comentario'
      })
    
    await Comment.destroy({where: {id}})
    
    res.json('Has borrado tu comentario')
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
  
}

export default deleteComment;