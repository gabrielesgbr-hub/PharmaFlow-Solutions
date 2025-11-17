const asyncHandler = require('express-async-handler');
const Inventario = require('../models/inventarioModel');
const Producto = require('../models/productosModel');
const Usuario = require('../models/usuariosModel');

const getRegistro = asyncHandler(async (req, res) => {
    const {id} = req.params;

    let registros;

    if (id) {
        registros = await Inventario.findByPk(id, {
            // Esto sirve para que no devuelva solo los ids, sino el nombre del producto, precio, etc, el usuario relacionado
            include: [
                { model: Producto, as: 'producto' },
                { model: Usuario, as: 'usuario' }
            ]
        });

        if (!registros) {
            res.status(400);
            throw new Error("Registro de inventario no encontrado");
        }
    } else {
        registros = await Inventario.findAll({
            include: [
                { model: Producto, as: 'producto' },
                { model: Usuario, as: 'usuario' }
            ]
        });
    }

    res.status(200).json(registros);
});

const createRegistro = asyncHandler(async (req, res) => {
    const { id_producto, id_usuario, lote, cantidad_disponible } = req.body;

    if (!id_producto || !id_usuario || !lote) {
        res.status(400);
        throw new Error("Favor de introducir todos los datos");
    }

    const nuevoRegistro = await Inventario.create({
        id_producto,
        id_usuario,
        lote,
        cantidad_disponible: cantidad_disponible || 0
    });

    res.status(201).json(nuevoRegistro);
});


const updateRegistro = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const registro = await Inventario.findByPk(id);

    if (!registro) {
        res.status(400);
        throw new Error("Registro no encontrado");
    }

    const registroActualizado = await registro.update({
        ...req.body, //... sirve para mezclar campos, actualiza todo lo que venga en el body y añade también la fecha actual"
        fecha_ult_actualizacion: new Date()
    });

    res.status(200).json(registroActualizado);
});

const deleteRegistro = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const registro = await Inventario.findByPk(id);

    if (!registro) {
        res.status(400);
        throw new Error("Registro no encontrado");
    }

    await registro.destroy();
    res.status(200).json({id});
}); 

module.exports = {
    getRegistro,
    createRegistro,
    updateRegistro,
    deleteRegistro
};




