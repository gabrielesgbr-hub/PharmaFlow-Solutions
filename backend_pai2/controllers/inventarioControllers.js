const asyncHandler = require('express-async-handler');
const Inventario = require('../models/inventarioModel');

const getRegistro = asyncHandler(async (req, res) => {
    const {id} = req.params;

    let registros;

    if (id) {
        registros = await Inventario.findByPk(id);

        if (!registros) {
            res.status(400);
            throw new Error("Registro de inventario no encontrado");
        }
    } else {
        registros = await Inventario.findAll();
    }

    res.status(200).json(registros);
});

const createRegistro = asyncHandler(async (req, res) => {
    const { id_producto, lote, cantidad_disponible } = req.body;

    if (!id_producto || !lote) {
        res.status(400);
        throw new Error("Favor de introducir todos los datos");
    }

    const nuevoRegistro = await Inventario.create({
        id_producto,
        id_usuario: req.usuario.id_usuario,
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

    if (req.body.version === undefined) {
        res.status(400);
        throw new Error("Version no encontrada");
    }

    try{
        if (req.body.version != registro.version) {
            res.status(409);
            throw new Error("Versión desactualizada: conflicto de concurrencia");
        }
        const registroActualizado = await registro.update({
            ...req.body, //... sirve para mezclar campos, actualiza todo lo que venga en el body y añade también la fecha actual"
            fecha_ult_actualizacion: new Date()
        });

        res.status(200).json(registroActualizado);
    } catch(error){
        throw error
    }
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




