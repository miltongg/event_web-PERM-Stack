import {Request, Response} from "express";
import {verifyToken} from "../../libs/tokenConfig";
import {JwtPayload} from "jsonwebtoken";
import {TOKEN} from "../../helpers/defineConsts";

export default async function verifyUserToken (req: Request, res: Response) {
  
  try {
    const token = req.headers[TOKEN] as string;
    let decodedToken: string | JwtPayload;
    
    if (token) {
      decodedToken = verifyToken(token);
      res.json(decodedToken);
    } else
      res.status(404).json({message: "Token no encontrado"})
  } catch (error: any) {
    res.status(500).json({
      message: error.message
    })
  }
  
}