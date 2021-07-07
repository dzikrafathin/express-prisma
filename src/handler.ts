import { PrismaClient } from '@prisma/client'
import { generateAccessToken } from './auth'

const prisma = new PrismaClient()

export default {
    async daftar(req: any, res: any) {
        const {nama, email, password} = req.body
        const penulis = 
            await prisma.penulis.create({
                data: {
                    nama,
                    email,
                    password
                }
            })
        res.json({
            status: true,
            code: 201,
            message: "Proses pendaftaran berhasil",
            data: penulis
        })
    },
    async login(req: any, res: any) {
        const { email, password } = req.body
        const penulis = 
            await prisma.penulis.findFirst({
                where: {email}
            })
        if (penulis) {
    
            if (penulis.password != password) {
                res.json({
                    status: false,
                    code: 400,
                    message: "Password salah"
                })
            }
    
            const token = generateAccessToken(
                penulis.id,
                penulis.email
            )

            res.json({
                status: true,
                code: 200,
                message: "Login berhasil",
                data: {
                    ...penulis,
                    token
                }
            })
    
        } else {
            res.json({
                status: false,
                code: 400,
                message: "Alamat E-Mail tidak terdaftar"
            })
        }
    
    },
    async daftarPostingan(req: any, res: any) {
        const daftarPostingan = 
            await prisma.postingan.findMany({
                where: {
                    published: true
                },
                select: {
                    id: true,
                    judul: true,
                    createdAt: true,
                    published: true,
                    penulis: {
                        select: {
                            id: true,
                            nama: true,
                            email: true
                        }
                    }
                }
            })

        res.json({
            status: true,
            code: 200,
            data: daftarPostingan
        })
    },
    async tambahPostingan(req: any, res: any) {
        const {email, judul, isi} = req.body

        const postinganBaru = 
            await prisma.postingan.create({
                data: {
                    judul,
                    isi,
                    penulis: {
                        connect: {email}
                    }
                },
                include: {
                    penulis: true
                }
            })
    
        res.json({
            status: true,
            code: 201,
            message: "Postingan baru berhasil dibuat",
            data: postinganBaru
        })
    
    },
    async lihatPostingan(req: any, res: any) {

        const { id } = req.params

        const postingan = await prisma.postingan.findFirst({
            where: {id: Number(id)},
            select: {
                id: true,
                judul: true,
                isi: true,
                createdAt: true,
                updatedAt: true,
                published: true,
                penulis: {
                    select: {
                        id: true,
                        nama: true,
                        email: true
                    }
                }
            }
        })

        res.json({
            status: true,
            code: 200,
            data: postingan
        })

    },
    async ubahPostingan(req: any, res: any) {
        const { id } = req.params

        const { judul, isi } = req.body
    
        const postingan = 
            await prisma.postingan.update({
                data: {
                    judul,
                    isi
                },
                where: {
                    id: Number(id)
                },
                include: {
                    penulis: true
                }
            })
    
        res.json({
            status: true,
            code: 200,
            message: "Data postingan berhasil diperbarui",
            data: postingan
        })
    },
    async publishPostingan(req: any, res: any) {
        const { id } = req.params

        await prisma.postingan.update({
            where: {
                id: Number(id)
            },
            data: {
                published: true
            }
        })
    
        res.json({
            status: true,
            code: 200,
            message: `Postingan dengan ${id} telah dipublikasi`
        })
    
    },
    async hapusPostingan(req: any, res: any) {
        const { id } = req.params

        await prisma.postingan.delete({
            where: {
                id: Number(id)
            }
        })
    
        res.json({
            status: true,
            code: 204,
            message: "Data postingan berhasil dihapus",
            data: null
        })
    
    }
}