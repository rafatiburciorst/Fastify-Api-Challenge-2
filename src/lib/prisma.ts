import { PrismaClient } from '@prisma/client'
import paginationExtension from 'prisma-pagination-extension';

const prisma = new PrismaClient().$extends(paginationExtension)
// const xprisma = prisma.$extends(paginationExtension)
// prisma.$extends(paginationExtension)

export { prisma }

