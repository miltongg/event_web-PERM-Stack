import { Request, Response } from "express";
import Event from "../../models/Event";

const getEventsList = async (req: Request, res: Response) => {
  try {
    let limit = req.headers.limit as number | undefined;
    let offset = req.headers.offset as number | undefined;

    if (!limit) limit = 10;

    if (!offset) offset = 0;

    const eventsList = await Event.findAll({
      limit,
      offset,
      order: [
        ['date', 'DESC']
      ]
    });

    res.json(eventsList);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error?.message,
    });
  }
};

export default getEventsList;
