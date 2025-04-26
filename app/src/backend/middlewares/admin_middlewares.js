import { pool } from '../bd/connectionPool.js'; 
import dotenv from 'dotenv'
dotenv.config()


export const checkAdmin_middleware = async (req, res, next) => {
    const admin = req.params.admin

    const queryAdminCheck = await pool.query('SELECT * FROM admins WHERE name_a = $1', [admin])

    if(queryAdminCheck.rows.length === 0) return res.json({message: 'No tienes permisos para ver esto', status: 'NOT ALLOWED'}) 

    next()
}   