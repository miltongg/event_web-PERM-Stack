import { Request, Response } from 'express'
import StatusCodes from 'http-status-codes'
import { RATING_PREFIX } from '../../helpers/defineConsts'
import randomId from '../../libs/randomId'
import Rating from '../../models/Rating'

const createRating = async (req: Request, res: Response) => {
    const { userId, rating } = req.body
    const { id } = req.params    

    try {
        const newRating = await Rating.create({
            id: RATING_PREFIX + randomId(),
            eventId: id,
            userId,
            rating,
        })

        res.json(newRating)
    } catch (error: any) {
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
        })
    }
}

export default createRating
