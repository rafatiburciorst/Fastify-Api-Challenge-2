import { FastifyInstance } from "fastify";

import { Authenticate } from "../auth/authenticate";
import { verifyToken } from "../middlewares/verify-token";

export async function authRoutes(app: FastifyInstance) {
    app.post('/login', Authenticate.login)
    app.get('/me', { onRequest: [verifyToken] }, Authenticate.profile)
}