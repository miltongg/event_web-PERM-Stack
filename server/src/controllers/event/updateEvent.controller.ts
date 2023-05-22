import { Request, Response } from "express";
import Event from "../../models/Event";
import unidecode from "unidecode";
import { StatusCodes } from "http-status-codes";
import moment from "moment";

const updateEvent = async (req: Request, res: Response) => {
  try {
    let {
      name,
      description,
      date,
      status,
      image,
      images,
      commentsCount,
      rating,
    } = req.body;

    const paramSlug = req.params.slug;
    const headerId = req.headers.id;

    if (date) date = moment(date, "DD/MM/YYYY - hh:mm A");

    const slugId = paramSlug ? paramSlug : headerId;
    const slug = name
      ? unidecode(name)
          .replace(/[^a-zA-Z0-9]/g, "-")
          .toLowerCase()
      : undefined;

    await Event.update(
      {
        name,
        slug,
        description,
        date,
        mainImage: image,
        status,
        eventImages: images,
        commentsCount,
        rating,
      },
      {
        where: { slug: slugId },
      }
    );

    res.json({
      message: "Se ha actualizado el evento correctamente",
    });
  } catch (error: any) {
    console.error(error?.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export default updateEvent;
