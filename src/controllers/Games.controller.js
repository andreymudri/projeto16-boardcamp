import db from "../database/database.js";

export async function GetGames(req, res) {
  try {
    const games = await db.query("SELECT * FROM games;");
    console.log("Get Games");
    res.send(games.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function PostGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;
  if (stockTotal <= 0 || pricePerDay <= 0) {
    return res.status(400).send("Dados inválidos");
  }
  try {
    const gameExists = await db.query(
      "SELECT * FROM games WHERE name=$1;",
      [name]
    );

    if (gameExists.rows.length > 0) {
      return res.status(409).send("Jogo já existente");
    }
    await db.query(
      "INSERT INTO games (name, image, stockTotal, pricePerDay) VALUES ($1, $2, $3, $4);",
      [name, image, stockTotal, pricePerDay]
    );
    res.status(201).send("Jogo adicionado com sucesso");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
