import express from 'express'
import { client } from './connectionPool.js'
import Cookies from 'js-cookie'


const app = express()
const PORT = 3000

try {
    // sirve para manejar rutas a interfaces html
    // app.use(express.static('src/front-end'))

    // enpoint para checar que exista el email
    app.post('/check-email/:email',
        // ==> middleware
        (req, res, next ) => {
            // recuperamos el valor que se le asigno al parametro email
            const email = req.params.email

            // si el parametro ha sido envidado nullo, imprimimos el error
            if(!email?.trim()) return res.status(500).send('No se envio correctamente')
            
            // implementar regex => TO-DO

            // si el parametro es correcto, lo mandamos
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
                        // crear variable de tiempo (current time)
                        const date = new Date()
                        // corregir el tiempo => TO-DO
                        Cookies.set('emailUsertoSetPassword', email, {expires: date.getMinutes() + 3})
                        console.log(`Tienes de ${date.getMinutes()} a ${date.getMinutes() + 3} para establecer tu contraseña`)
                    }
                 } else {
                    // enviar a login directamente
                 }
            }
        }
    )

    // app.post('/set-password', 
    //     // middleware
    //     (req, res, next) => {
    //         const { email, password } = req.body

    //         if(!email?.trim() || !password?.trim()) return res.status(500).send('Envio incorrecto')
            
    //         next()
    //     },
    //     (req, res) => {

    //     }
    // )

     // endpoint admin (solo para visualizar datos)
     app.get('/admin/:user',
        // => middleware
        async (req, res, next) => {
            // recuperamos el valor que se le asigno al parametro user
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
                
            // si los datos son obtenidos correctamente, imprimimos los datos
            res.send(result.rows)

        }
    )

    // endpoint para añadir estudiantes (solo admins)
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

    // puerto
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`)
    })





} catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err)
}
