import {Request, Response} from "express";
import News from "../../models/News";
import unidecode from "unidecode";

const updateNews = async (req: Request, res: Response) => {
  try {
    let {name, description, date, subtitle, tag, image, images} = req.body;
    const paramSlug = req.params.slug;
    const headerId = req.headers.id;
    
    if (date && date.includes("/")) {
      const [day, month, year] = date.split("/");
      date = `${year}/${month}/${day}`;
    }
    
    const slugId = paramSlug ? paramSlug : headerId;
    const slug = name ? unidecode(name).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase() : undefined;
    
    await News.update(
      {
        name,
        description,
        date,
        subtitle,
        tag,
        slug,
        mainImage: image,
      },
      {
        where: {slug: slugId},
      }
    );
    
    res.json({
      message: "Se ha actualizado la noticia correctamente",
    });
  } catch (error: any) {
    console.error(error?.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

export default updateNews;
