const path = require('path')
const express = require('express')

const app = express()
const port = process.env.PORT || 3000
const password = process.env.PROTOTYPE_PASSWORD

// Optional password gate: only active if PROTOTYPE_PASSWORD is set (username: any)
if (password) {
  app.use((req, res, next) => {
    const header = req.headers.authorization || ''
    const supplied = Buffer.from(header.replace('Basic ', ''), 'base64').toString().split(':')[1]
    if (supplied === password) return next()
    res.set('WWW-Authenticate', 'Basic realm="Prototype"').sendStatus(401)
  })
}

app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, () => console.log(`Prototype running at http://localhost:${port}`))
