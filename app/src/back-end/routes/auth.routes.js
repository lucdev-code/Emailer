import express from 'express'
import { verifyEmailStudent_middleware, setPassword_middleware, getCookie_middleware } from '../middlewares/auth_middlewares.js'
import { verifyEmailStudent, setPassword, getCookie } from '../controllers/auth.controller.js'

const router = express.Router()

// agregamos el metodo que realizara la ruta, seguida de su middleware, y por ultimo el enpoint real
router.post('/student/validateEmail', verifyEmailStudent_middleware, verifyEmailStudent)
router.get('/student/cookie', getCookie_middleware, getCookie)
router.post('/student/set-pasword', setPassword_middleware, setPassword)



export default router