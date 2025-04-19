import express from 'express'

const app = express()
const PORT = 3000

app.get('/:user',
    // middleware
    (req, res, next) => {
        const user = req.params.user
        if(user !== 'admin') {
            setTimeout(() => {   
            res.status(500).send('No tienes acceso')
            },2000)    
        }
        else {
            next()
        }
    },
    // response
    (req, res) => {
        res.send()
    }
)

app.post('/searchStudent/:to&')

app.listen(PORT,() => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`)
})
