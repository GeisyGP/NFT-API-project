const express = require('express')
const app = express()
const createMint = require('./mintNft')

require('dotenv').config()

app.use(express.json())

app.post('/create', async (req, res) => {
  const LIMIT = process.env.LIMIT
  const amount = 1
  
  const clientSpend = req.body.clientSpend
  const symbol = req.body.symbol
  const name = req.body.name
  const metadata = req.body.metadata
  const address = req.body.address

  if (!clientSpend || !symbol || !name || !metadata || !address )
    return res.status(400).json({ error: 'Campos obrigatórios faltando' })
  
  if (clientSpend < LIMIT) 
    return res.status(401).json({ error: 'Usuário não atingiu limite necessário para resgatar NFT!' })
  
  try {
    const info = await createMint({ amount, symbol, name, metadata, address })
    return res.status(200).json(info)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao criar o NFT' })
  }      
})

const port = 3000
app.listen(port, () => {
  console.log('Servidor rodando!')
})