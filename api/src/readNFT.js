const axios = require('axios')

async function readNFT(metadataHash) {
  try {
    const url = `https://ipfs.io/ipfs/${metadataHash}`
    const response = await axios.get(url)
    const nftDetails = response.data;
    return nftDetails
  } catch (error) {
    console.error(error)
    throw new Error('Erro ao obter os detalhes da NFT')
  }
}

module.exports = readNFT
  