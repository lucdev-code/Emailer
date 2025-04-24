import express from 'express'
import { client } from './connectionPool.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = 3000


try {
    const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];
    app.use(cookieParser());
    app.use(cors(
        {  
            origin: allowedOrigins,
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization'],
        }
    ));
    app.use(express.json())

    // enpoint para checar que exista el email
    app.get('/check-email/:email',
        (req, res, next) => {
            // const emailCookie = req.cookies.user_email
            // if(emailCookie) console.log('Encontrada la cookie')
            const email = req.params.email;
            if (!email?.trim()) return res.status(400).json({ error: 'Email no proporcionado' });
            
            const regexEmail = /^[a-z.]+@school\.dev$/
            if(regexEmail.test(email)) next()
            else return res.status(400).json( {error: 'Email invalido'} )
        },
        async (req, res) => {
            try {
                const email = req.params.email;

                const queryCheckEmail = await client.query('SELECT * FROM student WHERE email = $1', [email])
                if(queryCheckEmail.rows.length > 0) {
                    const userInfo = queryCheckEmail.rows[0]

                    if(userInfo.email_verified === true) return res.json( { success: true, mail: email, verified: true} )
                    else {
                        const queryVerifiedUpdate = await client.query('UPDATE student SET email_verified = $1 WHERE email = $2', [true, email])
                        if (queryVerifiedUpdate) {
                            res.cookie('user_email', email, {
                                httpOnly: true,            // solo accesible desde el servidor
                                maxAge: 3 * 60 * 1000,
                                path: '/' // pon `true` solo si estás usando HTTPS
                              });
                            return res.json( { success: true, mail: email, verified: false} )
                        } 
                    }
                }else {
                    return res.json ({
                        success: false,
                        mail: email,
                        message: 'El email no se ha encontrado'
                    })
                }
            } catch (error) {
                console.error('Error en /check-email:', error);
                res.status(500).json({
                    success: false,
                    error: 'Error al verificar el email'
                });
            }
        }
    )
    app.get('/set-password', 
         async (req, res) => {
            const emailCookie = await req.cookies.user_email
            console.log(emailCookie)

            if(emailCookie) res.json({message: 'Si se envio la cookie'})
            else  return res.json({ message: 'La cookie no se encontró' }); 
        }
    )

    // endpoint admin (solo para visualizar datos)
    app.get('/admin/:user',
        // => middleware
        async (req, res, next) => {
            // recuperamos el valor que se le asigno al parametro user
            const userName = req.params.user

            // ejecutamos una query donde checamos si existe el usuario
            const queryAdmin = await client.query('SELECT * FROM admins WHERE name_a = $1', [userName])

            // si el usuario no existe, imprimimos el error
            if (queryAdmin.rows.length === 0) return res.send('Oups, hubo un problema!')

            // si el usuario no tiene rol de admin, imprimimos el error
            if (queryAdmin.rows[0].rol !== 'admin') return res.send('No tienes acceso para ver esto').status(500)

            // si pasa estas condiciones, podra salir del middleware
            next()
        },
        async (req, res) => {
            // ejecutamos una query para visualizar todos los datos de estudiantes
            const result = await client.query('SELECT * FROM student')

            // si obtenemos un error al obtener los datos, imprimimos el error
            if (!result) return res.send('Hubo un error al obtener los datos')

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
            } else return res.status(500).send('Lo siento no se ha completado el registro, intenta mas tarde!')
        }
    )

    // puerto
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`)
    })


} catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err)
}
