const express = require('express')
const router = express.Router()
const {createReportes, getReportes, updateReportes, deleteReportes} = require('../controllers/reportesControllers')
const {protect, autenticarRol} = require('../middleware/authMiddleware')

router.get('/', protect, autenticarRol('investigador'), getReportes)
router.post('/', protect, autenticarRol('investigador'),  createReportes)
router.put('/:id', protect, autenticarRol('investigador'), updateReportes)
router.delete('/:id', protect, autenticarRol('investigador'), deleteReportes)

module.exports = router

