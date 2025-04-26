 // enpoint para checar que exista el email
    app.get('/check-email/:email',
        (req, res, next) => {
            // const emailCookie = req.cookies.user_email
            // if(emailCookie) console.log('Encontrada la cookie')
            const email = req.params.email;
            if (!email?.trim()) return res.status(400).json({ error: 'Email no proporcionado' });

            const regexEmail = /^[a-z.]+@school\.dev$/
            if (regexEmail.test(email)) next()
            else return res.status(400).json({ error: 'El email no cuenta con el formato esperado' })
        },
        async (req, res) => {
            try {
                const email = req.params.email;

                const queryCheckEmail = await pool.query('SELECT * FROM student WHERE email = $1', [email])
                if (queryCheckEmail.rows.length > 0) {
                    const userInfo = queryCheckEmail.rows[0]

                    if (userInfo.email_verified === true) {
                        res.cookie('user_email', email, {
                            maxAge: 3 * 60 * 1000,
                            path: '/',
                        });
                        return res.json({ success: true, mail: email, verified: true })
                    } 
                    else {
                        const queryVerifiedUpdate = await pool.query('UPDATE student SET email_verified = $1 WHERE email = $2', [true, email])
                        if (queryVerifiedUpdate) {
                            res.cookie('user_email', email, {
                                maxAge: 3 * 60 * 1000,
                                path: '/',
                            });
                            return res.json({ success: true, mail: email, verified: false })
                        }
                        if(userInfo.password !== null) {
                            return res.json({ success: true, mail: email, verified: true })
                        }
                    }
                } else {
                    return res.json({
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
    app.get('/get-cookie', async (req, res) => {
        const emailCookie = req.cookies.user_email;
    
        if (emailCookie) {
            return res.json({ message: 'Cookie ok', status: 'OK', email: emailCookie });
        } else {
            return res.json({ message: 'Cookie off', status: 'OFF' });
        }
    });

    app.post('/add-password', 
         (req, res, next) => {
        const email = req.cookies.user_email;
        const pass = req.body.password;
    
        if (!email || !pass) {
            return res.status(400).json({ error: 'Faltan datos' });
        } 

        next()
        },
        async (req, res) => {
            const email = req.cookies.user_email;
            const pass = req.body.password;
            const addUser = pool.query('UPDATE student SET password = $1 WHERE email = $2', [pass, email])

            if(addUser) return res.json({status:'OK', message: 'Usuario ha agregado su contrasena'})
            else return res.json({status: 'ERROR', message: 'Hubo un error al setear la contrasena'})
        }
    
    );

    app.post('/login', 
        (req, res, next) => {
            const email = req.cookies.user_email;
            const pass = req.body.password;

            if(!email || !pass) return res.json({message: 'No se encontraron las credenciales'})
            
            next()
        },
        async (req, res) => {
            const email = req.cookies.user_email;
            const pass = req.body.password;

            const queryLogin = await pool.query('SELECT * FROM student WHERE email = $1 AND password = $2', [email, pass])

            if(queryLogin.rows.length > 0) {
                res.json({status: 'OK', message: 'Encontrado'})
            }
            else res.json({status: 'NotFIND', message: 'No se ha encontrado el usuario'})
           
        }
    )



    // endpoint admin (solo para visualizar datos)
   

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
            const query = await pool.query(
                'INSERT INTO student (name_s, lastname_s, grade) VALUES ($1, $2, $3)',
                [nameS, lastS, grade]
            )
            if (query) {
                const correo = nameS.toLocaleLowerCase().replace(/\s+/g, '') + '.' + lastS.toLocaleLowerCase().replace(/\s+/g, '') + '@school.dev';
                res.send(`Te has registrado exitosamente, tu correo es: ${correo}`);
            } else return res.status(500).send('Lo siento no se ha completado el registro, intenta mas tarde!')
        }
    )
