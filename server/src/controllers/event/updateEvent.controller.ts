import { Request, Response } from "express";
import Event from "../../models/Event";

const updateEvent = async (req: Request, res: Response) => {
  try {

    let { name, description, date, image, images, commentsCount, rating } = req.body
    const paramId = req.params.id;
    const headerId = req.headers.id;
  

    if (date && date.includes('/')) {
      const [day, month, year] = date.split('/');
      date = `${year}-${month}-${day}`;
    }
    
    let id = paramId ? paramId : headerId
    
    await Event.update({
      name, description, date,
      mainImage: image,
      eventImages: images,
      commentsCount,
      rating
    }, {
      where: {id}
    })

    res.json({
      message: 'Se ha actualizado el evento correctamente'
    })

  } catch (error: any) {
    console.error(error?.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

export default updateEvent;
