import { pool } from '../bd/connectionPool.js';
import dotenv from 'dotenv'

dotenv.config()

export const getCookie = (req, res) => {
    try {
        const emailCookie = req.cookies.user_email

        if (!emailCookie) return res.json({ message: 'No se encontro la cookie', status: 'NOT FIND' })
        else return res.json({ mail: emailCookie, message: 'Si se encontro la cookie', status: 'OK' })
    } catch (error) {
        return res.json({message: 'Error al intentar', status: 'ERROR CATCH'})
    }
}

// validamos el email despues del middleware
export const verifyEmailStudent = async (req, res) => {
    try {
        const email = req.body.email

        if (!email?.trim()) return res.json({ message: 'No se envio el correo', status: 'FAIL' })

        const checkEmailQuery = await pool.query('SELECT * FROM student WHERE email = $1', [email])

        if (checkEmailQuery.rows.length > 0) {

            if (checkEmailQuery.rows[0].email_verified === true && checkEmailQuery.rows[0].password !== null) {
                res.cookie('user_email', email, {
                    maxAge: 3 * 60 * 1000
                });
                return res.json({ message: 'Se encontro el email!', status: 'OK', email_verified: true })
            }
            else {
                res.cookie('user_email', email, {
                    maxAge: 3 * 60 * 1000
                });
                return res.json({ message: 'Se encontro el email!', status: 'OK', email_verified: false })
            }
        }
        else return res.json({ message: 'No se encontro el correo', status: 'NOT FIND' })

    } catch (error) {
        res.json({ mesage: 'Hubo algun error, favor de intentar mas tarde', status: 'ERROR CATCH' })
    }
}

export const setPassword = async (req, res) => {
   try {
        const emailCookie = req.cookies.user_email
        const password = req.body.password

        if (!emailCookie || !password?.trim()) return res.json({ message: 'No se encontro la cookie o no se enviaron los datos correctamente', status: 'FAIL_2' })

        const setPassQuery = await pool.query('UPDATE student SET password = $1, email_verified = $2 WHERE email = $3', [password, true, emailCookie])
        if (setPassQuery) return res.json({ message: 'Todo en orden', status: 'OK' })

   } catch(error) {
        return res.json({message: 'Error al intentar', status: 'ERROR CATCH'})
   }
}

export const login = async (req, res) => {
  try { 
    const emailCookie = req.cookies.user_email
    const password = req.body.password

    if (!emailCookie || !password?.trim()) return res.json({ message: 'No se encontro la cookie o no se enviaron los datos correctamente', status: 'FAIL_2' })

    const loginQuery = await pool.query('SELECT * FROM student WHERE email = $1 AND password = $2', [emailCookie, password])
    if (loginQuery.rows.length > 0) return res.json({ message: 'Si se encontro el usuario', status: 'OK' })
    else return res.json({ message: 'No se encontro el usuario', status: 'FAIL' })
  } catch(error) {
    return res.json({message: 'Error al intentar', status: 'ERROR CATCH'})
  }
}   