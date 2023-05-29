import {Request, Response} from "express";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import {generateToken} from "../../libs/tokenConfig";
import {STATUS_PENDING} from "../../helpers/defineConsts";
import { StatusCodes } from "http-status-codes";

const signin = async (req: Request, res: Response) => {
  
  try {
    
    const { email, password } = req.body
    
    const user = await User.findOne({where: {email}})    
    
    if (user && Object.keys(user).length !== 0 && bcrypt.compareSync(password, user?.password)) {
      
      if (user.status === STATUS_PENDING)
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "Su correo no ha sido verificado, revise su correo"
        });
  
      const { password, status, updatedAt, createdAt, ...userInfo } = user?.dataValues;
  
      const token = generateToken(userInfo);

      await User.update({token}, {
        where: {id: user.id}
      });
      
      res.json(token);
      
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Correo o contraseña incorrecta"
      })
    }
    
  } catch (error: any) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
  
}

export default signin;