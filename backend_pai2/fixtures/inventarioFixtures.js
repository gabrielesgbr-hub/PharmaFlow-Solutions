const usuarioAutenticado = Object.freeze({ id_usuario: 7 })
 
const inventarioValido = Object.freeze({
  id_producto: 3,
  lote: 'L-9',
  cantidad_disponible: 5,
})
 
// ---------- Fixtures DINÁMICOS (Factory: defaults + overrides) ----------
const makeInventarioBody = (overrides = {}) => ({
  id_producto: 3,
  lote: 'L-9',
  cantidad_disponible: 5,
  ...overrides,
})
 
const makeUpdateBody = (overrides = {}) => ({
  version: 1,
  cantidad_disponible: 20,
  ...overrides,
})
 
// Registro "de base de datos": los jest.fn() son nuevos en cada llamada
const makeRegistroDb = (overrides = {}) => ({
  id: 1,
  version: 1,
  update: jest.fn().mockResolvedValue({}),
  destroy: jest.fn(),
  ...overrides,
})
 
const makeInventarioLista = (n = 2) =>
  Array.from({ length: n }, (_, i) => ({ id: i + 1, lote: `L-${i + 1}` }))
 
module.exports = {
  usuarioAutenticado,
  inventarioValido,
  makeInventarioBody,
  makeUpdateBody,
  makeRegistroDb,
  makeInventarioLista,
}