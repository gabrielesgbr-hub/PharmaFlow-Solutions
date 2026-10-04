const makeRes = () => {
  const res = {}
  res.status = jest.fn((code) => { res.statusCode = code; return res })
  res.json = jest.fn()
  return res
}
 
const makeReq = (overrides = {}) => ({
  params: {},
  body: {},
  ...overrides,
})
 
module.exports = { makeReq, makeRes }