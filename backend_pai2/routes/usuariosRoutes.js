const express = require('express')
const router = express.Router()
const {login, register, data, deleteUsuario, getUsuarios} = require('../controllers/usuariosControllers')
const {protect, autenticarRol} = require('../middleware/authMiddleware')

//endpoints publicos
router.post('/login', login)
router.post('/register', register)

//endpoints protegidos
router.get('/', protect, autenticarRol('gerente', 'investigador'), getUsuarios) //pendiente
router.get('/data', protect, data)
router.delete('/delete', protect, autenticarRol('gerente'), deleteUsuario)

module.exports = router