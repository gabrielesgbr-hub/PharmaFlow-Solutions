jest.mock('../models/inventarioModel')

const Inventario = require('../models/inventarioModel')
const { getRegistro, createRegistro, updateRegistro, deleteRegistro } = require('../controllers/inventarioControllers')

const buildRes = () => {
  const res = {}
  res.status = jest.fn((code) => { res.statusCode = code; return res; })
  res.json = jest.fn()
  return res
};

describe('inventarioController', () => {
  let res, next

  beforeEach(() => {
    jest.resetAllMocks()
    res = buildRes()
    next = jest.fn()
  })

  test('1. Value y Structural: deleteRegistro responde 200 y { id }', async () => {
    Inventario.findByPk.mockResolvedValue({ destroy: jest.fn() })
    const req = { params: { id: '5' } }

    await deleteRegistro(req, res, next)

    expect(res.statusCode).toBe(200)
    expect(res.json.mock.calls[0][0]).toStrictEqual({ id: '5' })
  })

  test('2. Behavioral y Mock: createRegistro llama a create una vez con los datos correctos', async () => {
    Inventario.create.mockResolvedValue({ id: 1 })
    const req = { body: { id_producto: 3, lote: 'L-9', cantidad_disponible: 5 }, usuario: { id_usuario: 7 } }

    await createRegistro(req, res, next)

    expect(Inventario.create).toHaveBeenCalledTimes(1)
    expect(Inventario.create).toHaveBeenCalledWith({ id_producto: 3, id_usuario: 7, lote: 'L-9', cantidad_disponible: 5 })
  })

  test('3. Asymmetric y Partial: updateRegistro manda los campos y una fecha dinámica', async () => {
    const registro = { version: 1, update: jest.fn().mockResolvedValue({}) }
    Inventario.findByPk.mockResolvedValue(registro)
    const req = { params: { id: 1 }, body: { version: 1, cantidad_disponible: 20 } }

    await updateRegistro(req, res, next)

    expect(registro.update).toHaveBeenCalledWith(
      expect.objectContaining({ cantidad_disponible: 20, fecha_ult_actualizacion: expect.any(Date) })
    )
  })

  test('4. Exceptions y Async: updateRegistro lanza error 409 por versión desactualizada', async () => {
    Inventario.findByPk.mockResolvedValue({ version: 5 })
    const req = { params: { id: 1 }, body: { version: 4 } }

    const promise = updateRegistro(req, res, next)

    await expect(promise).resolves.toBeUndefined()
    expect(res.statusCode).toBe(409)
    expect(() => { throw next.mock.calls[0][0]; }).toThrow('conflicto de concurrencia')
  })

  test('5. Existence y Truthiness: createRegistro asigna id_usuario y default de cantidad', async () => {
    Inventario.create.mockResolvedValue({ id: 1 })
    const req = { body: { id_producto: 3, lote: 'L-9' }, usuario: { id_usuario: 7 } }

    await createRegistro(req, res, next)

    const payload = Inventario.create.mock.calls[0][0]
    expect(req.body.cantidad_disponible).toBeUndefined()
    expect(payload.id_usuario).toBeDefined()
    expect(payload.lote).toBeTruthy()
    expect(payload.cantidad_disponible).toBeFalsy()
  })

  test('6. Collections y Strings: getRegistro devuelve la lista esperada', async () => {
    const buscado = { id: 2, lote: 'L-2' }
    Inventario.findAll.mockResolvedValue([{ id: 1, lote: 'L-1' }, buscado])
    const req = { params: {} }

    await getRegistro(req, res, next)

    const lista = res.json.mock.calls[0][0]
    expect(lista).toContain(buscado)
    expect(lista).toHaveLength(2)
    expect(lista[0].lote).toMatch(/^L-\d+$/)
  })
})