import 'dotenv/config'
import express from 'express'
import { prisma } from './utils/prisma.js'
import cors from 'cors'
import routes from './routes/index.js'
import errorMiddleware from './middleware/error.middleware.js'

const app  = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:80', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', app: 'Portfy API', version: '1.0.0', timestamp: new Date().toISOString() })
})

app.use('/api', routes)
app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Portfy API démarrée sur le port ${PORT}`)
  console.log(`Environnement : ${process.env.NODE_ENV}`)
})