const fetch = require('cross-fetch')
const FormData = require('form-data')
require('dotenv').config()

const USERNAME = process.env.INFURA_PROJECT_ID
const PASSWORD = process.env.INFURA_API_KEY
const X_WALLET_ID = process.env.X_WALLET_ID

async function upload(metadata) {
  const formData = new FormData();
  const metadataJson = JSON.stringify({ metadata })
  formData.append('file', metadataJson )
  
  const requestUrl = 'https://ipfs.infura.io:5001/api/v0/add'
  const config = {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(USERNAME + ':' + PASSWORD).toString('base64')
    },
    body: formData
  }

  const response = await fetch(requestUrl, config)

  if (!response.ok) {
    const errorResponse = await response.text();
    throw new Error(`Failed to upload metadata. Server response: ${errorResponse}`);
  }

  const metadataUploadResult = await response.json()
  
  const resultUpload = { ipfs: metadataUploadResult }
  return resultUpload
}

async function mint({ address, metadata, ...payload } = {}) {
  const uploadResult = await upload(metadata)

  const settings = {
    ...payload,
    xWalletId: X_WALLET_ID,
    data: `ipfs://ipfs/${uploadResult.ipfs.Hash}`
  }

  const issueNftResult = await issueNFT(settings)

  const nftResult = {
    ...payload,
    metadata: {
      metadataHash: uploadResult.ipfs.Hash,
      metadataUrl: `https://ipfs.io/ipfs/${uploadResult.ipfs.Hash}`
    },
    transaction: issueNftResult
  }
    return nftResult
}

async function issueNFT(payload) {
  try { 
    const urlHeadlessWallet = `http://localhost:8000/wallet/create-nft`
    const config = {
      method: 'POST',
      headers: { 'x-Wallet-id': X_WALLET_ID, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
    const result = await fetch(urlHeadlessWallet, config)
    const nft = await result.json()
    return nft
  } catch (error) {
    console.error(error)
    throw new Error('Erro ao criar NFT')
  }
}

module.exports = mint