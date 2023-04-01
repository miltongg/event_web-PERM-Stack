import {Request, Response} from "express";
import bcrypt from "bcryptjs";
import User from "../../models/User";
import OTP from "../../models/OTP";

export default async function forgotPassword (req: Request, res: Response) {
  
  try {
    
    let password = req.body.password as string;
    const confirmPassword = req.body.confirmPassword as string;
    const otp = req.body.code  as string;
    
    const code = await OTP.findOne({where: {otp}});
    
    if (!code) return res.status(404).json({
      message: "El código es incorrecto o ha expirado"
    })
  
    if (password !== confirmPassword)
      return res.status(401).json({
        message: "Las contraseñas no coinciden"
      })
  
    password = bcrypt.hashSync(password, 10);
    
    await User.update({password}, {where: {id: code.dataValues.userId}});
    
    res.json({message: "La contraseña se ha cambiado correctamente"})
    
  } catch ({message}) {
    console.log(message);
    return res.status(500).json({
      message
    })
  }
  
}