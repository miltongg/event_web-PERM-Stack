import { Request, Response } from "express";
import Event from "../../models/Event";
import Comment from "../../models/Comment";
import sequelize from "sequelize";
import { StatusCodes } from "http-status-codes";

const getEvent = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const id = (await Event.findOne({ where: { slug }, attributes: ["id"] }))
      ?.id;

    if (!id)
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Evento no encontrado",
      });

    const event = await Event.findOne({
      where: { id },
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", sequelize.col("Comments.id")),
            "commentsCount",
          ],
          [sequelize.fn("AVG", sequelize.col("Comments.rating")), "rating"],
        ],
      },
      include: [
        {
          model: Comment,
          as: "Comments",
          attributes: [],
        },
      ],
      group: ["Event.id"],
    });
    

    if (!event)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Evento no encontrado" });

    await Event.increment("views", { where: { id } });

    !event.views ? (event.views = 1) : event.views + 1;

    res.json(event);
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error?.message,
    });
  }
};

export default getEvent;
