import { pool } from '../bd/connectionPool.js'; 
import dotenv from 'dotenv'
dotenv.config()

export const login_admin_middleware = (req, res, next) => {
    const email_admin = req.body.email
    const password_admin = req.body.password

    if(!email_admin?.trim() || !password_admin?.trim()) return res.json({message: 'La informacion no se envio correctamente', status: 'FAIL'})

    const emailToRegex = /^[a-z.]+@admin\.dev$/

    if(!emailToRegex.test(email_admin)) return res.json({message: 'Lo siento no se pudo completar la accion', status: 'UNAUTHORIZED'})
    
    next()
}


export const checkAdmin_middleware = async (req, res, next) => {
    const admin = req.body.admin
z
    const queryAdminCheck = await pool.query('SELECT * FROM admins WHERE name_a = $1', [admin])

    if(queryAdminCheck.rows.length === 0) return res.json({message: 'No tienes permisos para ver esto', status: 'NOT ALLOWED'}) 

    next()
}   