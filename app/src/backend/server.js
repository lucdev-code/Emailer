import express from 'express'
import { client } from './connectionPool.js'

const app = express()
const PORT = 3000

try {
    // endpoint admin (solo para visualizar datos)
    app.get('/:user',
        // => middleware
        async (req, res, next) => {
            // obtenemos el parametro de user
            const userName = req.params.user

            // ejecutamos una query donde checamos si existe el usuario
            const queryAdmin = await client.query('SELECT * FROM admins WHERE name_a = $1', [userName])

            // si el usuario no existe, imprimimos el error
            if(queryAdmin.rows.length === 0) return res.send('Oups, hubo un problema!')

            // si el usuario no tiene rol de admin, imprimimos el error
            if(queryAdmin.rows[0].rol !== 'admin') return res.send('No tienes acceso para ver esto').status(500) 
            
            // si pasa estas condiciones, podra salir del middleware
            next()
        },
        async (req, res) => {
            // ejecutamos una query para visualizar todos los datos de estudiantes
            const result = await client.query('SELECT * FROM student')

            // si obtenemos un error al obtener los datos, imprimimos el error
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

    // enpoint para logearse
    app.post('/login/:email/:password', 
        async (req, res, next) => {

        },
        async (req, res) => {

        }
    )

    // puerto
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`)
    })





} catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err)
}
