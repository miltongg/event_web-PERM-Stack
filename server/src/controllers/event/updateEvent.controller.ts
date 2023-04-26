import { Request, Response } from "express";
import Event from "../../models/Event";
import unidecode from "unidecode";

const updateEvent = async (req: Request, res: Response) => {
  try {
    let { name, description, date, image, images, commentsCount, rating } =
      req.body;
    const paramSlug = req.params.slug;
    const headerId = req.headers.id;

    if (date && date.includes("/")) {
      const [day, month, year] = date.split("/");
      date = `${year}/${month}/${day}`;
    }

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
    res.status(500).json({
      message: error.message,
    });
  }
};

export default updateEvent;
