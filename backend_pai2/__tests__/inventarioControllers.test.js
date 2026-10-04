jest.mock('../models/inventarioModel')

const Inventario = require('../models/inventarioModel')
const { getRegistro, createRegistro, updateRegistro, deleteRegistro } = require('../controllers/inventarioControllers')
const { makeReq, makeRes } = require('../fixtures/httpFactory')
const {
  usuarioAutenticado,
  inventarioValido,
  makeInventarioBody,
  makeUpdateBody,
  makeRegistroDb,
  makeInventarioLista,
} = require('../fixtures/inventarioFixtures')

describe('inventarioController', () => {
  let res, next, listaInventario

  beforeAll(() => {
    listaInventario = makeInventarioLista(2)
  })

  afterAll(() => {
    listaInventario = null
  })

  beforeEach(() => {
    res = makeRes()
    next = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('1. Value y Structural: deleteRegistro responde 200 y { id }', async () => {
    Inventario.findByPk.mockResolvedValue(makeRegistroDb())
    const req = makeReq({ params: { id: '5' } })

    await deleteRegistro(req, res, next)

    expect(res.statusCode).toBe(200)
    expect(res.json.mock.calls[0][0]).toStrictEqual({ id: '5' })
  })

  test('2. Behavioral y Mock: createRegistro llama a create una vez con los datos correctos', async () => {
    Inventario.create.mockResolvedValue({ id: 1 })
    const req = makeReq({ body: inventarioValido, usuario: usuarioAutenticado })

    await createRegistro(req, res, next)

    expect(Inventario.create).toHaveBeenCalledTimes(1)
    expect(Inventario.create).toHaveBeenCalledWith({
      ...inventarioValido,
      id_usuario: usuarioAutenticado.id_usuario,
    })
  })

  test('3. Asymmetric y Partial: updateRegistro manda los campos y una fecha dinámica', async () => {
    const registro = makeRegistroDb({ version: 1 })
    Inventario.findByPk.mockResolvedValue(registro)
    const req = makeReq({ params: { id: 1 }, body: makeUpdateBody() })

    await updateRegistro(req, res, next)

    expect(registro.update).toHaveBeenCalledWith(
      expect.objectContaining({ cantidad_disponible: 20, fecha_ult_actualizacion: expect.any(Date) })
    )
  })

  test('4. Exceptions y Async: updateRegistro lanza error 409 por versión desactualizada', async () => {
    Inventario.findByPk.mockResolvedValue(makeRegistroDb({ version: 5 }))
    const req = makeReq({ params: { id: 1 }, body: makeUpdateBody({ version: 4 }) })

    const promise = updateRegistro(req, res, next)

    await expect(promise).resolves.toBeUndefined()
    expect(res.statusCode).toBe(409)
    expect(() => { throw next.mock.calls[0][0] }).toThrow('conflicto de concurrencia')
  })

  test('5. Existence y Truthiness: createRegistro asigna id_usuario y default de cantidad', async () => {
    Inventario.create.mockResolvedValue({ id: 1 })
    const req = makeReq({
      body: makeInventarioBody({ cantidad_disponible: undefined }),
      usuario: usuarioAutenticado,
    })

    await createRegistro(req, res, next)

    const payload = Inventario.create.mock.calls[0][0]
    expect(req.body.cantidad_disponible).toBeUndefined()
    expect(payload.id_usuario).toBeDefined()
    expect(payload.lote).toBeTruthy()
    expect(payload.cantidad_disponible).toBeFalsy()
  })

  test('6. Collections y Strings: getRegistro devuelve la lista esperada', async () => {
    Inventario.findAll.mockResolvedValue(listaInventario)
    const req = makeReq()

    await getRegistro(req, res, next)

    const lista = res.json.mock.calls[0][0]
    expect(lista).toContain(listaInventario[1])
    expect(lista).toHaveLength(2)
    expect(lista[0].lote).toMatch(/^L-\d+$/)
  })
})