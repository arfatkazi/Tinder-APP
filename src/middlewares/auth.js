const adminAuth = (req, res, next) => {
  if (!adminAuth) {
    return res.status(401).send('admin not authorized!')
  } else {
    next()
  }
}

module.exports = adminAuth
