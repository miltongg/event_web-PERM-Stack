import {Request, Response} from "express";
import User from "../../models/User";
import {TOKEN} from "../../helpers/defineConsts";


export default async function getLoggedUser(req: Request, res: Response) {

    try {

        const token = req.headers[TOKEN]

        const user = await User.findOne({where: {token}});

        if (!user)
            return res.status(404).json({message: "Usuario no encontrado"});

        const { password, ...userData } = user.dataValues

        res.json(userData);

    } catch ({message}) {
        res.status(500).json({
            message
        })
    }

}