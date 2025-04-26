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
            
            if(checkEmail.rows[0].email_verified === true && checkEmail.rows[0].password !== null) {
                res.cookie('user_email', email, {
                    maxAge: 3 * 60 * 1000
                });
                return res.json({message: 'Se encontro el email!', status: 'OK', email_verified: true})
            }
            else {
                const setemailverified = pool.query('UPDATE student SET email_verified = true')
                res.cookie('user_email', email, {
                    maxAge: 3 * 60 * 1000
                });
                return res.json({message: 'Se encontro el email!', status: 'OK', email_verified: false})
            }
        }
        else return res.json({message: 'No se encontro el correo', status: 'NOT FIND'})

    } catch(error) {
        res.json({mesage: 'Hubo algun error, favor de intentar mas tarde', status: 'ERROR CATCH'})
    }
}

export const setPassword = async (req, res) => {
    const emailCookie = req.cookies.user_email
    const password = req.body.password

    if(!emailCookie || !password?.trim()) return res.json({message: 'No se encontro la cookie o no se enviaron los datos correctamente', status: 'FAIL_2'})
    else return res.json({message: 'Todo en orden', emailCookie, password})
} 

export const getCookie = (req, res) => {
    const emailCookie = req.cookies.user_email

    if(!emailCookie) return res.json({message: 'No se encontro la cookie', status: 'NOT FIND'})
    else return res.json({mail: emailCookie, message: 'Si se encontro la cookie', status: 'OK'})
}