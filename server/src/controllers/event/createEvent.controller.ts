import { Request, Response } from "express";
import Event from "../../models/Event";
import randomId from "../../libs/randomId";
import { StatusCodes } from "http-status-codes";
import { EVENT_PREFIX } from "../../helpers/defineConsts";
import unidecode from "unidecode";

const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, date, description } = req.body;
    const { id } = req.headers;

    const event = await Event.create({
      id: EVENT_PREFIX + randomId(),
      userId: id,
      name,
      slug: unidecode(name)
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase(),
      date,
      description,
    });

    res.json(event);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error?.message,
    });
  }
};

export default createEvent;
