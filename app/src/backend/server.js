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
            // console.log(result.rows)
            if(!result) return res.send('Hubo un error al obtener los datos')
            res.send(result.rows)
        }
    )

    // endpoint to add student
    app.post('/students/add/:nameS/:lastS/:grade',
        // => middleware
        (req, res, next) => {
            const { nameS, lastS, grade } = req.params

            if (!nameS?.trim() || !lastS?.trim() || !grade?.trim()) return res.status(500).send('No se envio correctamente la informacion')

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

    app.post('/check-email/:email',
        // ==> middleware
        (req, res, next ) => {
            const email = req.params.email
            if(!email?.trim()) return res.status(500).send('No se envio correctamente')
            next()
        },
        async (req, res) => {
            const email = req.params.email
            const queryCheckEmail = await client.query('SELECT * FROM student WHERE email = $1', [email]) 
            if(queryCheckEmail.rows.length > 0) {
                const user = queryCheckEmail.rows[0]
                if(!user.email_verified) { 
                    const verifytoggle = await client.query('UPDATE student SET email_verified = TRUE WHERE id_student = $1', [user.id_student])
                    if(verifytoggle) {
                        res.send('Se ha confirmado el correo')
                        // return res.redirect(`/check-email/${user.email}/password`)
                    }
                 } else {
                    res.send('Ya se ha confirmado el correo anteriormente')
                 }
            }
        }
    )

    app.post('/check-email/:email/password', 
        // middleware
        (req, res, next) => {
            const { email, password } = req.body

            if(!email?.trim() || !password?.trim()) return res.status(500).send('Envio incorrecto')
            
            next()
        },
        (req, res) => {

        }
    )

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`)
    })


} catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err)
}
