const productoValido = Object.freeze({
  nombre: 'Paracetamol',
  principio_activo: 'Acetaminofén',
  presentacion: 'Tableta',
  precio_unitario: 15,
})

const makeProductoDb = (overrides = {}) => {
  const data = { id: 1, ...productoValido, ...overrides }
  return {
    ...data,
    update: jest.fn().mockResolvedValue(data),
    destroy: jest.fn(),
  }
}
 
module.exports = { productoValido, makeProductoDb }