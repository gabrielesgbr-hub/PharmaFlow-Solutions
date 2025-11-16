const asyncHandler = require('express-async-handler')
const Usuario = require('../models/usuariosModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const login = asyncHandler(async(req, res)=>{
    const {id_usuario, password} = req.body

    const usuario = await Usuario.findByPk(id_usuario)

    if(usuario && (await bcrypt.compare(password, usuario.password))){
        res.status(200).json({
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            rol_sql: usuario.rol_sql,
            fecha_registro: usuario.fecha_registro,
            token: generarToken(usuario.id_usuario)
        })
    }
})

const register = asyncHandler(async(req, res)=>{
    const {nombre, password, rol_sql} = req.body

    if (!nombre || !password || !rol_sql){
        res.status(400)
        throw new Error('Faltan datos')
    } else{
        const salt = await bcrypt.genSalt(10)
        const passwordHashed = await bcrypt.hash(password, salt)

        const usuario = await Usuario.create({
            nombre,
            password: passwordHashed,
            rol_sql
        })

        if(usuario){
            res.status(201).json({
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                rol_sql: usuario.rol_sql
            })
        } else{
            res.status(400)
            throw new Error ('No se pudieron guardar los datos')
        }
    }
})

const deleteU = asyncHandler(async(req, res)=>{
    const id_usuario = req.usuario.id_usuario

    const usuario = await Usuario.findByPk(id_usuario)
    
    if(!usuario){
        res.status(404)
        throw new Error("Usuario no encontrado")
    }else{
        await usuario.destroy()
        res.status(200).json({id_usuario:id_usuario}) 
    } 
})

const data = asyncHandler(async(req,res) => {
    res.status(200).json(req.usuario)
})

const generarToken = (id_usuario) => {
    return jwt.sign({id_usuario}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    login, register, data, deleteU
}