const express = require('express')
const dotenv = require('dotenv').config()
const connectMongo = require('./config/db_mongo')
const {connectPostgres} = require('./config/db_postgres')
const {errorHandler} = require('./middleware/errorMiddleware')

const port = process.env.PORT || 5000 

connectMongo() //nos conectamos a la base de datos de mongo atlas
connectPostgres() //nos conectamos a la base de datos postgres en render

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/usuarios', require('./routes/usuariosRoutes'))
app.use('/api/reportes', require('./routes/reportesRoutes'))

app.use(errorHandler)

app.listen(port, ()=>console.log(`Servidor Iniciado en el puerto: ${port}`))
console.log("HOLA CRAYOLA")