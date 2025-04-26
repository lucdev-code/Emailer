
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import adminRoutes from './routes/admin.routes.js'

const app = express()
const PORT = 3000

    const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];
    app.use(cookieParser());
    app.use(cors(
        {
            origin: allowedOrigins, // permite solo algunos origines para las peticiones
            credentials: true, // con esto decimos que se mandaran cookies
            allowedHeaders: ['Content-Type', 'Authorization'],
        }
    ));
    app.use(express.json())

try {
   
    app.use('/admin', adminRoutes)
   
    // puerto
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`)
    })


} catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err)
}
