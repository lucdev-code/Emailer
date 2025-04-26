import { pool } from '../bd/connectionPool.js'; 
import dotenv from 'dotenv'
dotenv.config()

// validamos el email despues del middleware
export const verifyEmailStudent = async (req, res) => {
    try {
        const email = req.body.email
        if(!email?.trim()) return res.json({message: 'No se envio el correo', status: 'FAIL'})
        const checkEmail = await pool.query('SELECT * FROM student WHERE email = $1', [email])
        if(checkEmail.rows.length > 0) {
            res.json({checkEmail, message: 'Se encontro el email!', status: 'OK'})
        }
    } catch(error) {
        res.json({mesage: 'Hubo algun error, favor de intentar mas tarde', status: 'ERROR CATCH'})
    }
}