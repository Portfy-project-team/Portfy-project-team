import express from 'express'
import { prisma } from './utils/prisma'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send(' API is running')
})

//  Test DB propre
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.listen(3000, () => {
  console.log(' Server running on http://localhost:3000')
})