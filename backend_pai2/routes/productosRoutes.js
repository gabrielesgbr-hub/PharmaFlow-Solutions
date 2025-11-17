const express = require('express');
const router = express.Router();
const {getProductos, createProductos, updateProductos,delateProductos} = require('../controllers/productosControllers');
const {protect, autenticarRol} = require('../middleware/authMiddleware');

router.get('/', protect, autenticarRol('gerente', 'investigador'), getProductos);
router.post('/', protect, autenticarRol('gerente'), createProductos);
router.put('/:id', protect, autenticarRol('gerente'), updateProductos);
router.delete('/:id', protect, autenticarRol('gerente'), delateProductos);
module.exports = router;