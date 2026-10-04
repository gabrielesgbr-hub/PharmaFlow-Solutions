const { createProductos, updateProductos, deleteProductos } = require('../controllers/productosControllers')
const Producto = require('../models/productosModel')
const Inventario = require('../models/inventarioModel')
const { makeReq, makeRes } = require('../fixtures/httpFactory')
const { productoValido, makeProductoDb } = require('../fixtures/productosFixtures')

jest.mock('../models/productosModel')
jest.mock('../models/inventarioModel')

describe('productosController', () => {
  let res, sequelizeOriginal

  beforeAll(() => {
    sequelizeOriginal = Producto.sequelize
  })

  afterAll(() => {
    Producto.sequelize = sequelizeOriginal
  })

  beforeEach(() => {
    res = makeRes()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('createProductos', () => {
    test('crea un producto con los datos dados', async () => {
      const req = makeReq({ body: productoValido })
      Producto.create.mockResolvedValue({ id: 1, ...productoValido })

      await createProductos(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
    })
  })

  describe('updateProductos', () => {
    test('actualiza un producto existente', async () => {
      const req = makeReq({ params: { id: 1 }, body: { precio_unitario: 25 } })
      Producto.findByPk.mockResolvedValue(makeProductoDb({ precio_unitario: 25 }))

      await updateProductos(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })
  })

  describe('deleteProductos', () => {
    beforeEach(() => {
      Producto.sequelize = {
        transaction: jest.fn().mockResolvedValue({ commit: jest.fn(), rollback: jest.fn() }),
      }
    })

    test('borra producto e inventarios relacionados', async () => {
      const req = makeReq({ params: { id: 1 } })
      Producto.findByPk.mockResolvedValue(makeProductoDb())
      Inventario.destroy.mockResolvedValue(1)

      await deleteProductos(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })
  })
})