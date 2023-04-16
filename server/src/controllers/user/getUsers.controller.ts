import { Request, Response } from "express";
import User from "../../models/User";
import { Op } from "sequelize";

const getUsers = async (req: Request, res: Response) => {
  try {
    const arr = req.headers.id as string;    

    const id = arr.split(',')
    

    console.log(id, "headers");

    const users: any = await User.findAll({
      where: {
        id: {
          [Op.in]: id,
        },
      },
    });

    res.json(users);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default getUsers;
