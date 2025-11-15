//Coleccion reportes en MongoDB
//Las referencias a la base de datos Postgres son logicas no fisicas

const mongoose = require('mongoose')

const reporteSchema = mongoose.Schema({
    titulo:{
        type: String, 
        required: [true, "Falta el titulo"]},

    contenido:{
        type: String, 
        required: [true, "Falta el contenido"]},

    autor:{
        // ID del usuario REAL en PostgreSQL
        id_usuario: { 
            type: Number, 
            required: [true, "Falta el id del usuario"]},
        // Nombre del usuario 
        nombre: { 
            type: String, 
            required: [true, "Falta el nombre del usuario"]}
    },

    producto: {
        // ID del producto real en PostgreSQL
        id_producto: { 
            type: Number, 
            required: [true, "Falta id del producto"]},
        nombre: { 
            type: String, 
            required: [true, "Falta el nombre del producto"]}
    },

    lote: {
        // Lote EXACTO del inventario
        type: String,
        required: [true, "Falta el lote"]
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Reporte', reporteSchema)