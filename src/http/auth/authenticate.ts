import { FastifyReply, FastifyRequest } from 'fastify'
import { decryptPassword } from 'src/lib/bcrypt'
import { prisma } from 'src/lib/prisma'
import { z } from 'zod'

export class Authenticate {

    static async login(request: FastifyRequest, reply: FastifyReply) {

        const schema = z.object({
            email: z.string().email(),
            password: z.string()
        })

        const { email, password } = schema.parse(request.body)

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        

        if (!user) {
            return reply.status(400).send({
                message: 'email or password does not match'
            })
        }

        const checkPassword = await decryptPassword(password, user.password)
        

        if (!checkPassword) {
            return reply.status(400).send({
                message: 'email or password does not match'
            })
        }

        const token = await reply.jwtSign({}, {
            sign: {
                sub: user.id
            }
        })

        return reply.status(200).send({
            token
        })

    }


    static async profile(request: FastifyRequest, reply: FastifyReply) {
        const getUserProfile = await prisma.user.findUnique({
            where: {
                id: request.user.sub
            }
        })
        
        return reply.status(200).send({
            user: {
                ...getUserProfile,
                password: undefined
            }
        })
    }
}