import express from "express";
import cors from "cors";
import Rentalsroute from "./routes/rentals/RentalsRouter.js";
import Gamesroute from "./routes/games/GamesRouter.js";
import Customerroute from "./routes/customers/CustomerRouter.js";
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.use(Rentalsroute);
app.use(Customerroute);
app.use(Gamesroute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Running on ${port}`));
