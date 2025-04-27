import express from 'express'
import { 
    verifyEmailStudent_middleware, 
    setPassword_middleware, 
    getCookie_middleware,
    login_middleware
} from '../middlewares/auth_middlewares.js'

import { 
    verifyEmailStudent, 
    setPassword, 
    getCookie, 
    login } from '../controllers/auth.controller.js'

const router = express.Router()

// agregamos el metodo que realizara la ruta, seguida de su middleware, y por ultimo el enpoint real
router.post('/student/validateEmail', verifyEmailStudent_middleware, verifyEmailStudent)
router.get('/student/cookie', getCookie_middleware, getCookie)
router.patch('/student/set-pasword', setPassword_middleware, setPassword)
router.post('/student/login', login_middleware, login)



export default router