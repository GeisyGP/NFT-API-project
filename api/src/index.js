const express = require('express')
const app = express()
const mint = require('./mintNft')
const read = require('./readNFT')
const fetch = require('cross-fetch')

require('dotenv').config()

app.use(express.json())

app.post('/create', async (req, res) => {
  const LIMIT = process.env.LIMIT
  const amount = 1
  
  const clientSpend = req.body.clientSpend
  const symbol = req.body.symbol
  const name = req.body.name
  const address = req.body.address
  const metadata = req.body.metadata
  

  if (!clientSpend || !symbol || !name || !metadata || !address )
    return res.status(400).json({ error: 'Campos obrigatórios faltando' })
  
  if (clientSpend < LIMIT) 
    return res.status(401).json({ error: 'Usuário não atingiu limite necessário para resgatar NFT!' })
  
  try {
    const info = await mint({ metadata, address, amount, symbol, name })
    return res.status(200).json(info)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao criar o NFT' })
  }      
})

app.get('/read/:hash', async (req, res) => {
  const metadataHash = req.params.hash

  if (!metadataHash)
    return res.status(400).json({ error: 'Metadata hash faltando' })

  try{
    const info = await read(metadataHash)
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

const port = 3000
app.listen(port, () => {
  console.log('Servidor rodando!')
})