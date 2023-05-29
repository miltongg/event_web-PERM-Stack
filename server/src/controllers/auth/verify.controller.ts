import {Request, Response} from "express";
import OTP from "../../models/OTP";
import User from "../../models/User";
import {generateToken} from "../../libs/tokenConfig"

export default async function verify (req: Request, res: Response) {
  
  try {
    
    const code = req.body.code as string;
    const findCode = await OTP.findOne({where: {otp: code}});
    
    if (!findCode)
      return res.status(404).json({
        message: "El código es incorrecto o ya ha expirado"
      });
    
    const user = await User.findOne({where: {id: findCode.dataValues.userId}})
    
    if (!user) return res.status(404).json({message: "Usuario no encontrado"})
    
    const { password, status, updatedAt, createdAt, ...userInfo } = user.dataValues;
    
    const token = generateToken(userInfo);
    
    const [updatedUser] = await User.update({token, status: "visible"}, {
      where: {id: findCode.dataValues.userId}
    });
    
    if (updatedUser > 0)
      await OTP.destroy({where: {otp: code}});
    
    res.json(token);
    
  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
  
}