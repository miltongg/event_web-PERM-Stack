import {Request, Response} from "express";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import {generateToken} from "../../libs/tokenConfig";
import {STATUS_PENDING} from "../../helpers/defineConsts";

export default async function signin (req: Request, res: Response) {
  
  try {
    
    const { email, password } = req.body
    
    const user = await User.findOne({where: {email}})
    
    if (Object.keys(user?.dataValues).length !== 0 && bcrypt.compareSync(password, user?.dataValues.password)) {
      
      if (user?.dataValues.status === STATUS_PENDING)
        return res.status(401).json({
          message: "Su correo no ha sido verificado, revise su correo"
        });
  
      const { password, status, updatedAt, createdAt, ...userInfo } = user?.dataValues;
  
      const token = generateToken(userInfo);

      await User.update({token}, {
        where: {id: user?.dataValues.id}
      });
      
      res.json(token);
      
    } else {
      res.status(404).json({
        message: "Correo o contraseña incorrecta"
      })
    }
    
  } catch ({message}) {
    console.log(message);
    return res.status(500).json({
      message
    })
  }
  
}