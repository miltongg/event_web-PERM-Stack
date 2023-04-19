import { Request, Response } from "express";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import {IMG_UPLOAD_PATH, ALLOWED_IMG, EVENT_PREFIX} from "../../helpers/defineConsts";
import randomId from "../../libs/randomId";

interface FileRequest extends Request {
  files: any;
  folder: string;
}

const uploadImgs = async (req: Request, res: Response) => {
  try {
    // get images
    let { file } = (req as FileRequest).files;

    if (!Array.isArray(file))
      file = [file]

    // get id and folder (user, event, ...)
    const id = req.headers.id as string;
    const folder = req.headers.folder as string;
    const prefix = req.headers.prefix as string;
    let count = 1;

    const imgList: string[] = [];

    if (!folder || !id)
      return res.status(404).json({ message: "Faltan datos" });

    for (let element of file) {
      const fileExt = element.mimetype.split("/")[1];
      element.name = `${prefix}_${randomId()}_screenshots`;
      count++;

      // check if imgs has valid extension, return error if not
      if (!ALLOWED_IMG.includes(fileExt))
        return res.status(401).json({
          message: `Por favor, seleccione un formato de imagen válido. ${ALLOWED_IMG}`,
        });

      // get path to save img in server
      const uploadImgsPath = path.join(
        __dirname,
        IMG_UPLOAD_PATH,
        folder,
        id + "/"
      );

      imgList.push(element.name);
      

      // create folder if not exist
      if (!existsSync(uploadImgsPath))
        mkdirSync(uploadImgsPath, { recursive: true });

      element.mv(uploadImgsPath + element.name, async (error: any) => {
        if (error) return res.status(500).json({ message: error });
      });
    }      

    return res.json({ images: imgList });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default uploadImgs;
