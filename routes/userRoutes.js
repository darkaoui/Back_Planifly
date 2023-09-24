import express from 'express'
const router = express.Router()
import { getUsers, getUserById, getFlights } from '../controllers/userController.js'

router.route('/').get(getUsers)
router.route('/:id').get(getUserById)
router.route('/flights/:idUser').get(getFlights)

export default router