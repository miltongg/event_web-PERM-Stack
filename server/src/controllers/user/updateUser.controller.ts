import {Request, Response} from "express";
import User from "../../models/User";


const updateUser = async (req: Request, res: Response) => {
  
  try {
    
    const {id} = req.params
    let { name, username, email, cell, socials, userImg } = req.body;
    const userId = req.user.id

    if (userId !== id) {
      console.log('User not found')
      return res.status(404).json({
        message: "Usuario no encontrado"
      })
    }
  
    const user = await User.findOne({where: {id: userId}});
  
    // console.log(user?.dataValues);
    
    if (user && Object.keys(user).length === 0) {
      console.log('User not found')
      return res.status(404).json({message: "Usuario no encontrado"})
    }
    
    const checkSocials = typeof socials
    
    if (checkSocials === "string")
      socials = [...user?.dataValues.socials, socials]
  
    // if (socials && typeof socials === string) {
    //   socials = user?.dataValues.socials
    //   console.log('entre en el if');
    // } else  {
    //   console.log('entre en el elseif');
    //   socials = [...user?.dataValues.socials, socials];
    // }
    //
    // if (!cell)
    //   cell = user?.dataValues.cell
    
    // if (socials && socials !== '') {
    //   socials = [...user?.dataValues.socials, socials]
    // } else {
    //   socials = user?.dataValues.socials
    // }
  
    // console.log(socials);
  
    // console.log('el social', req.body)
    
    await User.update({email, cell, name, username, socials, userImg}, {
      where: {id}
    })
    
    res.json({
      message: "Has actualizado tu perfil satisfactoriamente"
    })
    
  } catch (error: any) {
    
    res.status(500).json({
      message: error.message
    })
    
  }
  
}

export default updateUser;