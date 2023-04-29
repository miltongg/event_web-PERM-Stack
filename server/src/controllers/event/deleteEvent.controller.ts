import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { ADMIN_ROLE } from "../../helpers/defineConsts";
import Reply from "../../models/Reply";
import Comment from "../../models/Comment";
import Event from "../../models/Event";

const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Reply.destroy({ where: { elementId: id } });
    await Comment.destroy({ where: { eventId: id } });
    await Event.destroy({ where: { id } });

    res.json("Evento borrado satisfactoriamente");
  } catch (error: any) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export default deleteEvent;
