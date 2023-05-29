import { Request, Response } from "express";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { IMG_UPLOAD_PATH, ALLOWED_IMG } from "../../helpers/defineConsts";
import randomId from "../../libs/randomId";
import { StatusCodes } from "http-status-codes";

interface FileRequest extends Request {
  files: any;
  folder: string;
}

const uploadImg = async (req: Request, res: Response) => {
  try {
    // get images
    let data = (req as FileRequest)?.files;

    if (!data)
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No hay archivos seleccionados",
      });

    const file = data.file;

    // get id and folder (user, event, ...)
    const id = req.headers.id as string;
    const folder = req.headers.folder as string;
    const prefix = req.headers.prefix as string;
    let count = 1;

    if (!folder || !id)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Faltan datos" });

    const fileExt = file.mimetype.split("/")[1];

    if (!ALLOWED_IMG.includes(fileExt))
      return res.status(StatusCodes.FORBIDDEN).json({
        message: `Por favor, seleccione un formato de imagen válido. ${ALLOWED_IMG}`,
      });

    // file.name = randomId();
    file.name = prefix + "_" + randomId();

    const uploadPath = path.join(__dirname, IMG_UPLOAD_PATH, folder, id + "/");

    if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });

    file.mv(uploadPath + file.name, async (error: any) => {
      if (error) return res.status(500).json({ message: error });

      res.json({ image: file.name });
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default uploadImg;
