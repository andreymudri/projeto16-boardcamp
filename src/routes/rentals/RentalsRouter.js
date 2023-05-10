import { Router } from "express";




const Rentalsroute = Router();

Rentalsroute.get('/rentals');
Rentalsroute.post('/rentals');
Rentalsroute.post('/rentals/:id/return');
Rentalsroute.delete('/rentals/:id')


export default Rentalsroute