import { Router } from "express";
import validateRequestBody from "../../middlewares/SchemaMiddleware.js";
import { gameSchema } from "../../schemas/GamesSchema.js";
import { GetGames, PostGame } from "../../controllers/Games.controller.js";

const Gamesroute = Router();

Gamesroute.get("/games", GetGames);
Gamesroute.post("/games", validateRequestBody(gameSchema), PostGame);

export default Gamesroute;
