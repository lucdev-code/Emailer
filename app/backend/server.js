import express from 'express'
import { client } from './connectionPool.js'

const app = express()
const PORT = 3000

try {

    app.get('/:user',
        (req, res, next) => {
            const user = req.params.user
            if (user !== 'admin') {
                setTimeout(() => {
                    res.status(500).send('No tienes acceso')
                }, 2000)
            } else {
                next()
            }
        },
        async (req, res) => {
            const result = await client.query('SELECT * FROM student')
            res.send(result.rows)
        }
    )

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`)
    })

} catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err)
}
