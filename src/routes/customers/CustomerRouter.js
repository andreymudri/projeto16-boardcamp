import { Router } from "express";
import validateRequestBody from "../../middlewares/SchemaMiddleware.js";
import { CustomerSchema } from "../../schemas/CustomersSchema.js";
import { AddCustomer, EditCustomer, GetCustomer } from "../../controllers/Customer.controller.js";

const Customerroute = Router();

Customerroute.get("/customers", GetCustomer);
Customerroute.get("/customers/:id",GetCustomer);
Customerroute.post("/customers",validateRequestBody(CustomerSchema),AddCustomer);
Customerroute.put("/customers/:id",validateRequestBody(CustomerSchema),EditCustomer);

export default Customerroute;
