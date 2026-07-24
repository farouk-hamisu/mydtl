const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const isUUID = (s) => typeof s === 'string' && UUID_RE.test(s)

export const requireUUID = (...paramNames) => (req, res, next) => {
  for (const name of paramNames) {
    const val = req.params[name]
    if (val != null && !isUUID(val)) {
      return res.status(400).json({ error: `invalid ${name}: must be a valid UUID` })
    }
  }
  next()
}
