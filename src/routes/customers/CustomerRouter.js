import { Router } from "express";

const Customerroute = Router();

Customerroute.get("/customers");
Customerroute.get("/customers/:id");
Customerroute.post("/customers");
Customerroute.put("/customers/:id");

export default Customerroute;
