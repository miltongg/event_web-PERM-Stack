import { Request, Response } from "express";
import Event from "../../models/Event";
import sequelize, { Op, Order } from "sequelize";
import Comment from "../../models/Comment";
import { ADMIN_ROLE, STATUS_ACTIVE } from "../../helpers/defineConsts";
import Reply from "../../models/Reply";

const getEventsList = async (req: Request, res: Response) => {
  try {
    let limit = (req.headers.limit as string) || 10;
    let offset = (req.headers.offset as string) || 0;

    // const { query } = url.parse(req.url, true);

    if (typeof limit === "string") limit = Number(limit);
    if (typeof offset === "string") offset = Number(offset);

    const user = req.user;

    const filter = {
      status: user?.role === ADMIN_ROLE ? { [Op.ne]: "" } : STATUS_ACTIVE,
    };

    const sort: Order = [["date", "DESC"]];

    // const offset = query ? Number(limit * (query?.page - 1)) : 0;
    // else offset = parseInt(page);

    const eventsList = await Event.findAll({
      where: filter,
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "comments" AS "Comment" WHERE "Comment"."eventId" = "Event"."id") + (SELECT COUNT(*) FROM "replies" AS "Reply" JOIN "comments" AS "Comment" ON "Reply"."commentId" = "Comment"."id" WHERE "Comment"."eventId" = "Event"."id")`
            ),
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
          include: [
            {
              model: Reply,
              as: "Replies",
              attributes: [],
            },
          ],
        },
      ],
      subQuery: false,
      group: ["Event.id"],
      order: sort,
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
