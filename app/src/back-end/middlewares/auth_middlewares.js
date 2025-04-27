import { pool } from '../bd/connectionPool.js'; 
import dotenv from 'dotenv'
dotenv.config()


// verificamos que exista la cookie
export const getCookie_middleware = (req, res, next) => {
    const email = req.cookies.user_email

    if(!email) return res.json({message: 'No se ha encontrado la cookie', status: 'FAIL'})

    next()
}


// verificamos que el email no sea nulo y le pasamos por un test sobre el regex para ver si tiene la estructura solicitada
export const verifyEmailStudent_middleware = async (req, res, next) => {
    const email = req.body.email

    if(!email?.trim()) return res.json({message: 'No se ha enviado correctamente el email', status: 'FAIL'})
    
    const emailToRegex = /^[a-z.]+@school\.dev$/

    if(!emailToRegex.test(email)) return res.json({message: 'El correo no cumple con la estructura', status: 'NOT VALID'})
    
    next()
}

// verificamos que los campos no sean nullos
export const setPassword_middleware = (req, res, next) => {
    const emailCookie = req.cookies.user_email
    const password = req.body.password

    if(!emailCookie || !password?.trim()) return res.json({message: 'No se ha enviado correctamente la informacion', status: 'FAIL'})

    next()
}

export const login_middleware = (req, res, next) => {
    const email = req.cookies.user_email
    const password = req.body.password

    if(!email || !password?.trim()) return res.json({message: 'No se ha enviado correctamente la informacion', status: 'FAIL'})
    
    next()
}