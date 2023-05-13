import db from "../database/database.js";

export async function GetRental(req, res) {
  try {
    const rentals = await db.query(`
    SELECT rentals.id, rentals."customerId", rentals."gameId", rentals."rentDate", rentals."daysRented", rentals."returnDate", rentals."originalPrice", rentals."delayFee", customers.id AS "customerId", customers.name AS "customerName", games.id AS "gameId", games.name AS "gameName"
    FROM rentals
    JOIN customers ON rentals."customerId" = customers.id
    JOIN games ON rentals."gameId" = games.id;    
    `);

    const rentalsWithCustomerAndGame = rentals.rows.map((rental) => {
      return {
        id: rental.id,
        customerId: rental.customerId,
        gameId: rental.gameId,
        rentDate: rental.rentDate,
        daysRented: rental.daysRented,
        returnDate: rental.returnDate,
        originalPrice: rental.originalPrice,
        delayFee: rental.delayFee,
        customer: {
          id: rental.customerId,
          name: rental.customerName,
        },
        game: {
          id: rental.gameId,
          name: rental.gameName,
        },
      };
    });
    res.status(200).json(rentalsWithCustomerAndGame);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving rentals from database");
  }
}

export async function PostRental(req, res) {
  try {
    const { customerId, gameId, daysRented } = req.body;

    const customer = await db.query(
      `
      SELECT * FROM customers WHERE id = $1
    `,
      [customerId]
    );
    if (customer.rowCount === 0) {
      return res.status(400).send("Cliente não encontrado");
    }

    const game = await db.query(
      `
      SELECT * FROM games WHERE id = $1
    `,
      [gameId]
    );
    if (game.rowCount === 0) {
      return res.status(400).send("Jogo não encontrado");
    }

    const rentedGames = await db.query(
      `
    SELECT COUNT(*) FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL
  `,
      [gameId]
    );
    const availableGames = game.rows[0].stockTotal - rentedGames.rows[0].count;
    if (availableGames <= 0) {
      return res.status(400).send("Não há jogos disponíveis para aluguel");
    }

    const rentDate = new Date();
    const originalPrice = daysRented * game.rows[0].pricePerDay;

    await db.query(
      `
  INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice", "returnDate", "delayFee")
  VALUES ($1, $2, $3, $4, $5, NULL, NULL)
`,
      [customerId, gameId, rentDate, daysRented, originalPrice]
    );

    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}
export async function DeleteRental(req, res) {
  try {
    const rentalId = req.params.id;
    const rental = await db.query(
      `
      SELECT * FROM rentals WHERE id = $1
    `,
      [rentalId]
    );
    if (rental.rowCount === 0) {
      return res.status(404).send("Aluguel não encontrado");
    }

    if (rental.rows[0].returnDate !== null) {
      return res.status(400).send("Aluguel já finalizado");
    }

    await db.query(
      `
      DELETE FROM rentals WHERE id = $1
    `,
      [rentalId]
    );

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}
export async function ReturnRental(req, res) {
  try {
    const rentalId = req.params.id;

    const rental = await db.query(
      `
      SELECT * FROM rentals WHERE id = $1
    `,
      [rentalId]
    );
    if (rental.rowCount === 0) {
      return res.status(404).send("Aluguel não encontrado");
    }

    if (rental.rows[0].returnDate !== null) {
      return res.status(400).send("Aluguel já finalizado");
    }

    const returnDate = new Date();
    const daysLate = Math.ceil(
      (returnDate - rental.rows[0].rentDate) / (1000 * 60 * 60 * 24)
    );
    const delayFee =
      daysLate > rental.rows[0].daysRented
        ? (daysLate - rental.rows[0].daysRented) *
          rental.rows[0].gamePricePerDay
        : 0;

    await db.query(
      `
      UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3
    `,
      [returnDate, delayFee, rentalId]
    );
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}
