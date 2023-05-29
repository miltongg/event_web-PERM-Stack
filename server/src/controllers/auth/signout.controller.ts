import {Request, Response} from "express";
import User from "../../models/User";
import {verifyToken} from "../../libs/tokenConfig";

export default async function signout(req: Request, res: Response) {
  
  try {
    const id = req.headers.id as string;
    const token = req.headers['token'] as string;
    
    const decodedToken = verifyToken(token);
    
    if (id !== decodedToken.id)
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    
    await User.update({token: ''}, {
      where: {id}
    });
    
    res.json({message: "Te has desconectado"})
  } catch (error: any) {
    console.error(error.message)
    res.status(500).json({
      message: error.message
    })
  }
}