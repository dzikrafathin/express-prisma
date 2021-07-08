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
    async lihatProfil(req: any, res: any) {

        const penulis =
            await prisma.penulis.findFirst({
                where: {
                    id: req.user.id,
                    email: req.user.email
                }
            })

        res.json({
            status: true,
            code: 200,
            data: {
                id: penulis?.id,
                nama: penulis?.nama,
                email: penulis?.email
            }
        })
    },
    async daftarPostingan(req: any, res: any) {

        const idPenulis = req.user.id;

        const daftarPostingan = 
            await prisma.postingan.findMany({
                where: {
                    penulisId: idPenulis,
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

        const {judul, isi} = req.body
        const { email } = req.user;

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

        const idPenulis = req.user.id;

        const postinganPenulisId = await prisma.postingan.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                penulisId: true
            }
        })

        if (postinganPenulisId?.penulisId != idPenulis) {
            res.sendStatus(403);
        }
        
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

        const idPenulis = req.user.id;

        let postingan = 
            await prisma.postingan.findFirst({
                where: {
                    id: Number(id)
                },
                select: {
                    penulisId: true
                }
            })
        
        if (postingan?.penulisId != idPenulis) {
            res.sendStatus(403);
        }

        const { judul, isi } = req.body

        postingan = 
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

        const idPenulis = req.user.id;

        const postingan = 
            await prisma.postingan.findFirst({
                where: {
                    id: Number(id)
                }
            })
        
        if (postingan?.penulisId != idPenulis) {
            res.sendStatus(403);
        }

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

        const idPenulis = req.user.id

        const postingan = await prisma.postingan.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                penulisId: true
            }
        })

        if (postingan?.penulisId != idPenulis) {
            res.sendStatus(403);
        }

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