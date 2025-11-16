const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuariosModel')
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]

            // Decodificar el token → trae { id_usuario: ... }
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Buscar usuario en PostgreSQL
            req.usuario = await Usuario.findByPk(decoded.id_usuario, {
                attributes: ['id_usuario', 'nombre', 'rol_sql', 'fecha_registro']
            })

            if (!req.usuario) {
                res.status(401)
                throw new Error("Usuario no encontrado")
            }

            next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error("Token inválido")
        }
    }

    if (!token) {
        res.status(401)
        throw new Error("No autorizado, no hay token")
    }
})

module.exports = { protect }
