import { Request, Response } from "express";
import Event from "../../models/Event";
import randomId from "../../libs/randomId";
import {StatusCodes} from "http-status-codes";

const createEvent = async (req: Request, res: Response) => {

  try {
    const { name, date, description } = req.body;
    const {id} = req.headers;
    
    console.log('ESTE ES EL BODY', req.body);
    console.dir(date)
  
    const event = await Event.create({
      id: 'event_' + randomId(),
      userId: id,
      name,
      date,
      description
    });    

    res.json(event);

  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error?.message
    });
  }
};

export default createEvent;