const express = require('express')
const router = express.Router()
const {createReportes, getReportes, updateReportes, deleteReportes} = require('../controllers/reportesControllers')
const {protect} = require('../middleware/authMiddleware')

router.get('/', protect, getReportes)
router.post('/', protect, createReportes)
router.put('/:id', protect, updateReportes)
router.delete('/:id', protect, deleteReportes)

module.exports = router

