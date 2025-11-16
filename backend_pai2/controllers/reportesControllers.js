const asyncHandler = require('express-async-handler')
const Reporte = require('../models/reportesModel')

const getReportes = asyncHandler(async(req, res)=>{
    const reportes = await Reporte.find({ "autor.id_usuario": req.usuario.id_usuario })
    res.status(200).json(reportes)
})

const createReportes = asyncHandler(async(req, res)=>{
    if(!req.body.titulo || !req.body.contenido || !req.body.producto || !req.body.lote){
        res.status(400)
        throw new Error('Favot de introducir los datos completos')
    }
    const reporte = await Reporte.create({
        titulo: req.body.titulo,
        contenido: req.body.contenido,
        autor: {
            id_usuario: req.usuario.id_usuario, 
            nombre: req.usuario.nombre},
        producto: {
            id_producto: req.body.producto.id_producto,
            nombre: req.body.producto.nombre
        },
        lote: req.body.lote
    })
    res.status(201).json(reporte)
})

const updateReportes = asyncHandler(async(req, res)=>{
    const reporte = await Reporte.findById(req.params.id)
    if(!reporte){
        res.status(400)
        throw new Error('Reporte no encontrado')
    }

    if(reporte.autor.id_usuario !== req.usuario.id_usuario){
        res.status(401)
        throw new Error('Acceso no autorizado')
    } else{
        const reporteUpdated = await Reporte.findByIdAndUpdate(req.params.id, req.body, {new:true})
        res.status(200).json(reporteUpdated) 
    }
})

const deleteReportes = asyncHandler(async(req, res)=>{
    const reporte = await Reporte.findById(req.params.id)
    if(!reporte){
        res.status(400)
        throw new Error('Reporte no encontrado')
    }

    if(reporte.autor.id_usuario !== req.usuario.id_usuario){
        res.status(401)
        throw new Error('Acceso no autorizado')
    } else{
        await Reporte.deleteOne()
        res.status(200).json({id: req.params.id}) 
    } 
})

module.exports = {
    getReportes,
    createReportes,
    updateReportes,
    deleteReportes
}