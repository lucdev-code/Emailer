import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Client } = pg
 
export const client = new Client({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
})
await client.connect()

console.log('✅ Conectado a PostgreSQL')
