const express = require('express')
const router = express.Router()
const {getRegistro, createRegistro, updateRegistro, deleteRegistro} = require('../controllers/inventarioControllers')
const {protect, autenticarRol} = require('../middleware/authMiddleware')

router.get('/', protect, autenticarRol('gerente', 'investigador'), getRegistro) //Todos los registros
router.get('/:id', protect, autenticarRol('gerente', 'investigador'), getRegistro) //Especifico por ID
router.post('/', protect, autenticarRol('gerente'), createRegistro)
router.put('/:id', protect, autenticarRol('gerente'), updateRegistro)
router.delete('/:id', protect, autenticarRol('gerente'), deleteRegistro)

module.exports = router
    