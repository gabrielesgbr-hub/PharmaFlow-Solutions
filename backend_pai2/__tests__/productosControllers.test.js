const {createProductos, updateProductos, deleteProductos} = require('../controllers/productosControllers')
const Producto = require('../models/productosModel')
const Inventario = require('../models/inventarioModel')

jest.mock('../models/productosModel')
jest.mock('../models/inventarioModel')

test('createProductos - crea un producto con los datos dados', async () => {
    // arrange
    const req = { body: { nombre: 'Paracetamol', principio_activo: 'Acetaminofén', presentacion: 'Tableta', precio_unitario: 15 } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    Producto.create.mockResolvedValue({ id: 1, ...req.body })

    // act
    await createProductos(req, res)

    // assert
    expect(res.status).toHaveBeenCalledWith(201)
})

test('updateProductos - actualiza un producto existente', async () => {
    // arrange
    const req = { params: { id: 1 }, body: { precio_unitario: 25 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    Producto.findByPk.mockResolvedValue({ update: jest.fn().mockResolvedValue({ id: 1, precio_unitario: 25 }) })

    // act
    await updateProductos(req, res)

    // assert
    expect(res.status).toHaveBeenCalledWith(200)
})

test('deleteProductos - borra producto e inventarios relacionados', async () => {
    // arrange
    const req = { params: { id: 1 } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    Producto.sequelize = { transaction: jest.fn().mockResolvedValue({ commit: jest.fn(), rollback: jest.fn() }) }
    Producto.findByPk.mockResolvedValue({ id: 1, destroy: jest.fn() })
    Inventario.destroy.mockResolvedValue(1)

    // act
    await deleteProductos(req, res)

    // assert
    expect(res.status).toHaveBeenCalledWith(200)
})