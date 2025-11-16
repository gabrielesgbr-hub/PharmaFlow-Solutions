const express = require('express')
const router = express.Router()
const {login, register, data, deleteU} = require('../controllers/usuariosControllers')
const {protect} = require('../middleware/authMiddleware')

//endpoints publicos
router.post('/login', login)
router.post('/register', register)

//endpoint privado todavia sin proteccion
router.get('/data', protect, data)
router.delete('/delete', protect, deleteU)

module.exports = router