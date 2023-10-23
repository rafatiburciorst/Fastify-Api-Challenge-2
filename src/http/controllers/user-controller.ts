import { FastifyReply, FastifyRequest } from 'fastify'
import { encryptPassword } from 'src/lib/bcrypt'
import { prisma } from 'src/lib/prisma'
import { z } from 'zod'

export class UserController {

    static async create(request: FastifyRequest, reply: FastifyReply) {

        const schema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string()
        })

        const data = schema.parse(request.body)
        const encrypt = await encryptPassword(data.password)

        try {
            await prisma.user.create({
                data: {
                    ...data,
                    password: encrypt
                }
            })

            reply.status(201).send()

        } catch (error: any) {
            reply.status(400).send({
                message: error.message
            })
        }
    }


    static async findMany(request: FastifyRequest, reply: FastifyReply) {
        const users = await prisma.user.findMany()
        
        const data = users.map((user) => {
            return {
                ...user,
                password: undefined
            }
        })

        return {
            data
        }
    }

}