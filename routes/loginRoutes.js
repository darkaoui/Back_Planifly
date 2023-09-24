import express from 'express'
const router = express.Router()
import { loginUser } from '../controllers/loginController.js'

router.route('/:logs').post(loginUser)

export default router