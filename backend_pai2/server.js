const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db_mongo')
const {connectPostgres} = require('./config/db_postgres')

const port = process.env.PORT || 5000 

connectDB() //nos conectamos a la base de datos de mongo atlas
connectPostgres()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.listen(port, ()=>console.log(`Servidor Iniciado en el puerto: ${port}`))
console.log("HOLA CRAYOLA")