import fastfyJwt from '@fastify/jwt'
import fastify from 'fastify'

import { authRoutes } from './http/routes/auth-routes'
import { userRoutes } from './http/routes/user-routes'
import { foodRoutes } from './http/routes/food-routes'

export const app = fastify()

app.register(fastfyJwt, {
    secret: 'secret'
})

app.register(userRoutes)
app.register(authRoutes)
app.register(foodRoutes)