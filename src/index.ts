import cors from 'cors'
import express from 'express'
import handler from './handler'
import dotenv from 'dotenv'
import { authJwt } from './auth'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.get('/profil', authJwt, handler.lihatProfil)
app.post('/daftar', handler.daftar)
app.post('/login', handler.login)

app.get('/postingan', authJwt, handler.daftarPostingan)
app.post('/postingan', authJwt, handler.tambahPostingan)
app.get('/postingan/:id', authJwt, handler.lihatPostingan)
app.put('/postingan/:id/publish', authJwt ,handler.publishPostingan)
app.put('/postingan/:id', authJwt ,handler.ubahPostingan)
app.delete('/postingan/:id', authJwt ,handler.hapusPostingan)

const server = app.listen(3000, () => {
    console.log('Server Berjalan')
})