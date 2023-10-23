import { UserController } from "../controllers/user-controller";
import { FastifyInstance } from "fastify";

export async function userRoutes(app: FastifyInstance) {
    app.post('/users', UserController.create)
    app.get('/users', UserController.findMany)
}