import {Request, Response} from "express";
import path from "path";
import {existsSync} from "fs";
import exp from "constants";


const getImg = async (req: Request, res: Response) => {

    try {

        const {subfolder, name, folder} = req.params;

        console.log(req.params);
        
        
        // if (!id)
        //     return res.status(400).json({
        //         message: 'id vacío'
        //     });

        // if (!folder)
        //     return res.status(400).json({
        //         message: 'folder vacío'
        //     })
        
        const pathFile = path.join(__dirname, `../../uploads/img/${folder}/${subfolder}/${name}`);
    

        if (!existsSync(pathFile))
            return res.status(400).json({
                message: 'No existe la dirección del archivo'
            });

        res.sendFile(pathFile);

    } catch (error: any) {
        res.status(500).json({
            message: error.message
        })
    }

}

export default getImg;