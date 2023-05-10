import { Router } from "express";
import validateRequestBody from "../../middlewares/SchemaMiddleware.js";
import { gameSchema } from "../../schemas/GamesSchema.js";
import { GetGames } from "../../controllers/Games.controller.js";

const Gamesroute = Router();

Gamesroute.get("/games", GetGames);
Gamesroute.post("/games", validateRequestBody(gameSchema));

export default Gamesroute;
