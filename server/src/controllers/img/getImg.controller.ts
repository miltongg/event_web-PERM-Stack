import {Request, Response} from "express";
import path from "path";
import {existsSync} from "fs";
import exp from "constants";


const getImg = async (req: Request, res: Response) => {

    try {

        const {id, folder} = req.params;
        
        if (!id)
            return res.status(400).json({
                message: 'id vacío'
            });

        // if (!folder)
        //     return res.status(400).json({
        //         message: 'folder vacío'
        //     })
        
        const pathFile = path.join(__dirname, `../../uploads/img/${folder}/${id}`);
    

        if (!existsSync(pathFile))
            return res.status(400).json({
                message: 'No existe la dirección del archivo'
            });

        res.sendFile(pathFile);

    } catch ({message}) {
        res.status(500).json({
            message
        })
    }

}

export default getImg;