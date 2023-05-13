import { Router } from "express";
import validateRequestBody from "../../middlewares/SchemaMiddleware.js";
import {
  DeleteRental,
  GetRental,
  PostRental,
  ReturnRental,
} from "../../controllers/Rentals.controller.js";
import { rentalSchema } from "../../schemas/RentalsSchema.js";

const Rentalsroute = Router();

Rentalsroute.get("/rentals", GetRental);
Rentalsroute.post("/rentals", validateRequestBody(rentalSchema), PostRental);
Rentalsroute.post("/rentals/:id/return", ReturnRental);
Rentalsroute.delete("/rentals/:id", DeleteRental);

export default Rentalsroute;
