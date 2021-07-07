import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import handler from './handler'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.post('/daftar', handler.daftar)
app.post('/login', handler.login)

app.get('/postingan', handler.daftarPostingan)
app.post('/postingan', handler.tambahPostingan)
app.get('/postingan/:id', handler.lihatPostingan)
app.put('/postingan/:id/publish', handler.publishPostingan)
app.put('/postingan/:id', handler.ubahPostingan)
app.delete('/postingan/:id', handler.hapusPostingan)

const server = app.listen(3000, () => {
    console.log('Server Berjalan')
})