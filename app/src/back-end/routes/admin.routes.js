import express from 'express'
import { checkAdmin_middleware, login_admin_middleware } from '../middlewares/admin_middlewares.js'
import { getStudents, login_admin } from '../controllers/admin.controller.js'

const router = express.Router()

// agregamos el metodo que realizara la ruta, seguida de su middleware, y por ultimo el enpoint real

router.get('/getStudents', checkAdmin_middleware, getStudents)
router.post('/log', login_admin_middleware, login_admin)


export default router