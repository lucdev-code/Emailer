import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg
 
export const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
})
await pool.connect()

console.log('✅ Conectado a PostgreSQL')
