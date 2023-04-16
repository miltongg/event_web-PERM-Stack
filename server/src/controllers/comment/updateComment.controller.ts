import { Request, Response } from "express";
import Comment from "../../models/Comment";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { comment, userImg, username, rating, repliesCount } = req.body;

    console.log(req.body);

    // if (userImg)
      await Comment.update(
        { userImg, comment, username, rating, repliesCount },
        {
          where: {
            [Op.or]: [{ userId: id }, {id}],
          },
        }
      );
    // else if (comment)
    //   await Comment.update(
    //     { comment },
    //     {
    //       where: { id },
    //     }
    //   );
    // else {
    //   await Comment.update(
    //     { username },
    //     {
    //       where: { userId: id },
    //     }
    //   );
    // }

    res.json("Has actualizado tu comentario");
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export default updateComment;
