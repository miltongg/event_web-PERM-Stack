import { Request, Response } from "express";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { IMG_UPLOAD_PATH, ALLOWED_IMG } from "../../helpers/defineConsts";
import randomId from "../../libs/randomId";

interface FileRequest extends Request {
  files: any;
  folder: string;
}

const uploadImg = async (req: Request, res: Response) => {
  try {
    // get images
    let { file } = (req as FileRequest).files;

    console.log(file, "files");

    // get id and folder (user, event, ...)
    const id = req.headers.id as string;
    const folder = req.headers.folder as string;
    const prefix = req.headers.prefix as string;
    let count = 1;

    const imgList: string[] = [];

    if (!folder || !id)
      return res.status(404).json({ message: "Faltan datos" });

    if (Array.isArray(file)) {
      for (let element of file) {
        const fileExt = element.mimetype.split("/")[1];
        element.name = `${id}_${count}`;
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
    }

    const fileExt = file.mimetype.split("/")[1];

    if (!ALLOWED_IMG.includes(fileExt))
      return res.status(401).json({
        message: `Por favor, seleccione un formato de imagen válido. ${ALLOWED_IMG}`,
      });

    // file.name = randomId();
    file.name = id;

    const uploadPath = path.join(__dirname, IMG_UPLOAD_PATH, folder, id + "/");

    console.log(uploadPath);

    if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });

    file.mv(uploadPath + file.name, async (error: any) => {
      if (error) return res.status(500).json({ message: error });

      res.json({ image: file.name });
    });
  } catch ({ message }: any) {
    res.status(500).json({ message });
  }
};

export default uploadImg;
