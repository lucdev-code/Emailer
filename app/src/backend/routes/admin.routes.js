import express from 'express'
import { checkAdmin } from '../middlewares/admin_middleware.js'
import { getStudents } from '../controllers/admin.controller.js'

const router = express.Router()

router.get('/getStudents/:admin', checkAdmin, getStudents)

export default router