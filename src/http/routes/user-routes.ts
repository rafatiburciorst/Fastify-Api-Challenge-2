import { FastifyInstance } from "fastify";

import { UserController } from "../controllers/user-controller";
import { verifyToken } from "../middlewares/verify-token";

export async function userRoutes(app: FastifyInstance) {
    app.post('/users', UserController.create)
}