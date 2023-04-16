import { Request, Response, NextFunction } from "express";
import { TOKEN, ADMIN_ROLE, MODERATOR_ROLE } from "../helpers/defineConsts";
import User from "../models/User";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers[TOKEN];

    if (!token)
      return res.status(401).json({
        message: "Necesitas autenticarte",
      });

    const user = await User.findOne({ where: { token } });

    if (!user)
      return res.status(401).json({
        message: "Necesitas autenticarte",
      });

    delete user?.dataValues.password;

    req.user = user?.dataValues;

    next();
  } catch ({ message }: any) {
    res.status(500).json({
      message,
    });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== ADMIN_ROLE)
    return res.status(401).json({ message: "No estas autorizado" });

  next();
};

export const isModerator = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== ADMIN_ROLE && req.user.role !== MODERATOR_ROLE)
    return res.status(401).json({ message: "No estas autorizado" });

  next();
};


