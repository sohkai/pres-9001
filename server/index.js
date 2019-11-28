const express = require('express')
const execute = require('child_process').execSync

const clear = require('clear')

const app = express()
app.use(express.static('build'))

app.post('/initiate-sequence', function(req, res) {
  console.log('          ... Initiating deployment sequence ...')
  console.log()
  console.log('          ... Connecting private key ...')
  console.log()
  execute(`cd deploy && npm run deploy:court:mainnet`, { stdio: 'inherit' })
  res.send()
})

app.listen(9001, () => {
  clear()
  console.log()
  console.log()
  console.log('                        PRES-9001')
  console.log()
  console.log()
  console.log()
  console.log('          ... Awaiting your command on port 9001...')
  console.log()
  console.log()
})
