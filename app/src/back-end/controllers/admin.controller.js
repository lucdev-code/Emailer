import { pool } from '../bd/connectionPool.js'; 
import dotenv from 'dotenv'
dotenv.config()

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