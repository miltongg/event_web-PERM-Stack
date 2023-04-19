import {Request, Response} from "express";
import path from "path";
import {existsSync, mkdirSync} from "fs";
import {IMG_UPLOAD_PATH, ALLOWED_IMG, EVENT_PREFIX} from "../../helpers/defineConsts";
import randomId from "../../libs/randomId";

interface FileRequest extends Request {
  files: any;
  folder: string;
}

const uploadImg = async (req: Request, res: Response) => {
  try {
    // get images
    let {file} = (req as FileRequest).files;
    
    // get id and folder (user, event, ...)
    const id = req.headers.id as string;
    const folder = req.headers.folder as string;
    const prefix = req.headers.prefix as string;
    let count = 1;
    
    
    if (!folder || !id)
      return res.status(404).json({message: "Faltan datos"});
    
    const fileExt = file.mimetype.split("/")[1];
    
    if (!ALLOWED_IMG.includes(fileExt))
      return res.status(401).json({
        message: `Por favor, seleccione un formato de imagen válido. ${ALLOWED_IMG}`,
      });
    
    // file.name = randomId();
    file.name = prefix + '_' + randomId();
    
    const uploadPath = path.join(__dirname, IMG_UPLOAD_PATH, folder, id + "/");
    
    if (!existsSync(uploadPath)) mkdirSync(uploadPath, {recursive: true});
    
    file.mv(uploadPath + file.name, async (error: any) => {
      if (error) return res.status(500).json({message: error});
      
      res.json({image: file.name});
    });
  } catch (error: any) {
    res.status(500).json({message: error.message});
  }
};

export default uploadImg;
