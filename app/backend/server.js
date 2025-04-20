import express from 'express'
import { client } from './connectionPool.js'

const app = express()
const PORT = 3000

try {
    // endpoint admin
    app.get('/:user',
        // => middleware
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

    // endpoint to add student
    app.post('/students/add/:nameS/:lastS/:grade',
        // => middleware
        (req, res, next) => {
            const { nameS, lastS, grade } = req.params

            if (!nameS?.trim() || !lastS?.trim() || !grade?.trim()) return res.status(400).send('No se envio correctamente la informacion')

            next()
        },
        async (req, res) => {
            const { nameS, lastS, grade } = req.params
            const query = await client.query(
                'INSERT INTO student (name_s, lastname_s, grade) VALUES ($1, $2, $3)',
                [nameS, lastS, grade]
            )
            if (query) {
                const correo = nameS.toLocaleLowerCase().replace(/\s+/g, '') + '.' + lastS.toLocaleLowerCase().replace(/\s+/g, '') + '@school.dev';
                res.send(`Te has registrado exitosamente, tu correo es: ${correo}`);
            }else return res.status(500).send('Lo siento no se ha completado el registro, intenta mas tarde!')
        }
    )

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`)
    })

} catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err)
}
