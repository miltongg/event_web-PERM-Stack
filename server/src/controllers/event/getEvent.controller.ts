import {Request, Response} from "express";
import Event from "../../models/Event";

const getEvent = async (req: Request, res: Response) => {
  
  const {id} = req.params;
  
  try {
    
    const event = await Event.findOne({
      where: {id}
    });
    
    if (!event)
      return res.status(404).json({message: 'Evento no encontrado'});
    
    res.json(event);
    
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error?.message
    })
  }
  
}

export default getEvent;