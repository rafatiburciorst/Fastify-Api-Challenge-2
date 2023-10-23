import { FastifyInstance } from "fastify";

import { FoodController } from "../controllers/food-controller";
import { verifyToken } from "../middlewares/verify-token";

export async function foodRoutes(app: FastifyInstance) {
    app.post('/foods', {onRequest: [verifyToken]},FoodController.create)
    app.get('/foods', {onRequest: [verifyToken]},FoodController.findMany)
    app.put('/foods/:id', {onRequest: [verifyToken]},FoodController.update)
    app.delete('/foods/:id', {onRequest: [verifyToken]},FoodController.delete)
    app.get('/foods/:id', {onRequest: [verifyToken]},FoodController.findOne)
    app.get('/foods/stats', {onRequest: [verifyToken]},FoodController.stats)
}