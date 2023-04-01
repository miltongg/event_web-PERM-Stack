import {Request, Response} from "express";
import User from "../../models/User";

export default async function getUser(req: Request, res: Response) {
  
  try {

    const { id } = req.params;
    
    const user = await User.findOne({where: {id}});
  
    if (!user)
      return res.status(404).json({message: "Usuario no encontrado"});

    const { token, password, ...userData } = user.dataValues
  
    res.json(userData);
  } catch (error: any) {
    res.status(500).json({
      message: error.message
    })
  }
  
  
  
}