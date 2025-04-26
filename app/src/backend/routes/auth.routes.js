import express from 'express'
import { verifyEmailStudent_middleware } from '../middlewares/auth_middlewares.js'
import { verifyEmailStudent } from '../controllers/auth.controller.js'

const router = express.Router()

// agregamos el metodo que realizara la ruta, seguida de su middleware, y por ultimo el enpoint real
router.post('/student/validateEmail', verifyEmailStudent_middleware ,verifyEmailStudent)



export default router