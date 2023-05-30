const express = require('express')
const app = express()
require('dotenv').config()

app.use(express.json())

const port = 3000
app.listen(port, () => {
  console.log('Servidor rodando!')
})