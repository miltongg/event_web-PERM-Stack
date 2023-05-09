import { Request, Response } from "express";
import Event from "../../models/Event";
import sequelize from "sequelize";
import Comment from "../../models/Comment";
import url from "url";

const getEventsList = async (req: Request, res: Response) => {
  try {
    let limit = req.headers.limit as number | undefined;
    let offset = req.headers.offset as number | undefined;

    // const { query } = url.parse(req.url, true);

    if (!limit) limit = 10;
    if (!offset) offset = 0;

    // const offset = query ? Number(limit * (query?.page - 1)) : 0;
    // else offset = parseInt(page);

    const eventsList = await Event.findAll({
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
      subQuery: false,
      group: ["Event.id"],
      order: [["date", "DESC"]],
      limit,
      offset,
    });

    const count = await Event.count();

    res.json({
      eventsList,
      count,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error?.message,
    });
  }
};

export default getEventsList;
