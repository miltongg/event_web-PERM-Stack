import { Router } from 'express'
import createRating from '../controllers/rating/createRating.controller'
import { verifyToken } from '../middlewares/authJwt'

const router = Router()

router.post('/rating/:id', verifyToken, createRating)

export default router
