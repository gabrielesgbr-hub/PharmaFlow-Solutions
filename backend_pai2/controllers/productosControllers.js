const Producto = require('../models/productoModel');

// Listar todos los productos
const listarProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los productos" });
    }
};

// Crear un nuevo producto
const crearProducto = async (req, res) => {
    try {
        const { nombre, principio_activo, presentacion, precio_unitario } = req.body;

        const nuevoProducto = await Producto.create({
            nombre,
            principio_activo,
            presentacion,
            precio_unitario
        });

        res.json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el producto" });
    }
};

// Actualizar un producto existente
const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, principio_activo, presentacion, precio_unitario } = req.body;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        producto.nombre = nombre || producto.nombre;
        producto.principio_activo = principio_activo || producto.principio_activo;
        producto.presentacion = presentacion || producto.presentacion;
        producto.precio_unitario = precio_unitario || producto.precio_unitario;

        await producto.save();

        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto" });
    }
};

module.exports = {
    listarProductos,
    crearProducto,
    actualizarProducto
};