const asyncHandler = require('express-async-handler')
const Usuario = require('../models/usuariosModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const login = asyncHandler(async(req, res)=>{
    const {nombre, password} = req.body

    const usuario = await Usuario.findOne({where:{nombre}})

    if(usuario && (await bcrypt.compare(password, usuario.password))){
        res.status(200).json({
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            rol_sql: usuario.rol_sql,
            fecha_registro: usuario.fecha_registro,
            token: generarToken(usuario.id_usuario)
        })
    } else{
        res.status(404)
        throw new Error ('Datos del usuario incorrectos')
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

const deleteUsuario = asyncHandler(async(req, res)=>{
    const usuario = await Usuario.findByPk(req.params.id_usuario)
    
    if(!usuario){
        res.status(404)
        throw new Error("Usuario no encontrado")
    }else{
        await usuario.destroy()
        res.status(200).json({id_usuario:id_usuario}) 
    } 
})

const getUsuarios = asyncHandler(async(req, res)=>{
    const usuarios = await Usuario.findAll()
    res.status(200).json(usuarios)
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
    login, register, data, deleteUsuario, getUsuarios
}