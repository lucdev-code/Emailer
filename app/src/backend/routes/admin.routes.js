import express from 'express'
import { checkAdmin_middleware } from '../middlewares/admin_middlewares.js'
import { getStudents } from '../controllers/admin.controller.js'

const router = express.Router()

// agregamos el metodo que realizara la ruta, seguida de su middleware, y por ultimo el enpoint real
router.get('/getStudents/:admin', checkAdmin_middleware, getStudents)


export default router