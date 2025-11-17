const asyncHandler = require('express-async-handler');
const Producto = require('../models/productosModel');
const Inventario = require('../models/inventarioModel');

const getProductos = asyncHandler(async (req, res) => {
    const productos = await Producto.findAll();
    res.status(200).json(productos);
});

const createProductos = asyncHandler(async (req, res) => {
    const { nombre, principio_activo, presentacion, precio_unitario} = req.body;

    if (!nombre || !principio_activo || !presentacion || !precio_unitario) {
        res.status(400);
        throw new Error('Favor de introducir todos los datos del producto');
    }

    const nuevoProducto = await Producto.create({
        nombre,
        principio_activo,
        presentacion,
        precio_unitario,
    });

    res.status(201).json(nuevoProducto);
});

const updateProductos = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);

    if (!producto) {
        res.status(400);
        throw new Error('Producto no encontrado');
    }

    const productoActualizado = await producto.update(req.body);

    res.status(200).json(productoActualizado);
});

const delateProductos = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);

    if (!producto) {
        res.status(400);
        throw new Error('Producto no encontrado');
    }

    // Borrar inventarios que usan este producto
    await Inventario.destroy({
        where: { id_producto: id }
    });

    // Borrar el producto
    await producto.destroy();
    res.status(200).json({ id });
});

module.exports = {
    getProductos,
    createProductos,
    updateProductos,
    delateProductos
};