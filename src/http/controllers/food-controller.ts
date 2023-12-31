import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "src/lib/prisma";
import { z } from "zod";

export class FoodController {

    static async create(request: FastifyRequest, reply: FastifyReply) {
        const schema = z.object({
            name: z.string(),
            description: z.string(),
            diet: z.coerce.boolean(),
            date: z.coerce.date()
        })

        const data = schema.parse(request.body)
        try {
            await prisma.food.create({
                data: {
                    ...data,
                    userId: request.user.sub
                }
            })

            return reply.status(201).send()
        } catch (error) {
            return reply.status(400).send({
                message: 'Bad request'
            })
        }
    }

    static async findMany(request: FastifyRequest, reply: FastifyReply) {

        const schema = z.object({
            page: z.coerce.number().optional().default(1),
            pageSize: z.coerce.number().optional().default(10)
        })

        const { page, pageSize } = schema.parse(request.query)
        //@ts-ignore
        const [foods, meta] = await prisma.food.paginate({
            where: {
                userId: request.user.sub
            },
            pagination: {
                page,
                pageSize,
            },
        })

        return reply.status(200).send({
            foods,
            meta
        })
    }

    static async update(request: FastifyRequest, reply: FastifyReply) {

        const schema = z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            diet: z.coerce.boolean().optional(),
            date: z.coerce.date()
        })

        const schemaParams = z.object({
            id: z.string()
        })

        const { id } = schemaParams.parse(request.params)

        const exists = await prisma.food.findUnique({
            where: {
                id
            }
        })

        if (!exists) {
            return reply.status(400).send({
                message: 'Food not found'
            })
        }

        const data = schema.parse(request.body)

        await prisma.food.update({
            where: {
                id,
            },
            data: {
                ...data
            }
        })

        return reply.status(204).send()
    }

    static async delete(request: FastifyRequest, reply: FastifyReply) {
        const schemaParams = z.object({
            id: z.string()
        })

        const { id } = schemaParams.parse(request.params)

        const user = await prisma.user.findUnique({
            where: {
                id: request.user.sub
            }
        })

        if (!user) {
            return reply.status(401).send({
                message: 'unauthorized'
            })
        }

        const food = await prisma.food.findUnique({
            where: {
                id
            }
        })

        if (!food) {
            return reply.status(401).send({
                message: 'Food not found'
            })
        }

        if (user.id === food.userId) {
            await prisma.food.delete({
                where: {
                    id
                }
            })
            return reply.status(204).send()
        }
    }

    static async findOne(request: FastifyRequest, reply: FastifyReply) {
        const schemaParams = z.object({
            id: z.string()
        })

        const { id } = schemaParams.parse(request.params)

        const user = await prisma.user.findUnique({
            where: {
                id: request.user.sub
            }
        })

        if (!user) {
            return reply.status(401).send({
                message: 'unauthorized'
            })
        }

        const food = await prisma.food.findUnique({
            where: {
                id
            }
        })

        if (!food) {
            return reply.status(401).send({
                message: 'Food not found'
            })
        }

        if (user.id === food.userId) {
            const food = await prisma.food.findFirst({
                where: {
                    id
                }
            })
            return reply.status(200).send({
                food
            })
        }
    }

    static async stats(request: FastifyRequest, reply: FastifyReply) {
        const foods = await prisma.food.findMany({
            where: {
                userId: request.user.sub
            },
        })

        const amount = foods.length
        const inDiet = foods.filter((diet) => diet.diet).length
        const outInDiet = amount - inDiet

        return reply.status(200).send({
            amount,
            inDiet,
            outInDiet
        })
    }

    static async getBetterFoodSequence(request: FastifyRequest, reply: FastifyReply) {
        const foods = await prisma.food.count({
            where: {
                diet: true
            }
        })

        return {
            count: foods
        }
        // const best = foods.reduce((prev, next) => prev.date >= next.date ? prev : next)
        // console.log(best);

    }
}