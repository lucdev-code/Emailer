import { pool } from '../bd/connectionPool.js'; 
import dotenv from 'dotenv'
dotenv.config()

export const login_admin = async (req, res) => {
  try {
    const email_admin = req.body.email
    const password_admin = req.body.password

    // query
    const login_admin_query = await pool.query('SELECT * FROM admins WHERE email_a = $1 AND password_a = $2', [email_admin, password_admin])

    // verificamos
    if(login_admin_query.rows.length > 0) return res.json({message: 'Si se encontro el correo del admin', status: 'OK'})
    else return res.json({message: 'No se encontro el usuario', status: 'NOT FIND'})

  }catch(error) {
    return res.json({message: 'Hubo un error al intentar', status: 'ERROR CATCH'})
  }
}

export const getStudents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM student');
    res.json(result.rows);  // Responde con los resultados de la consulta
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};


export const addStudent = async (req, res) => {
    
}