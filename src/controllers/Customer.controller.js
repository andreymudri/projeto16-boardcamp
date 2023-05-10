import db from "../database/database.js";

export async function GetCustomer(req, res) {
  const paramID = req.params.id;
  let customer;
  try {
    if (!paramID) {
      customer = await db.query("SELECT * FROM customers");
    } else {
      customer = await db.query("SELECT * FROM customers WHERE id = $1", [
        paramID,
      ]);
    }
    res.send(customer.rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function AddCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  try {
    const checkcpf = await db.query("SELECT * FROM customers WHERE cpf=$1", [
      cpf,
    ]);
    if (checkcpf.rows.length > 0) {
      return res.sendStatus(409);
    }

    await db.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function EditCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  const { id } = req.params;
  try {
    const checkCpf = await db.query(
      "SELECT * FROM customers WHERE cpf=$1 AND id<>$2",
      [cpf, id]
    );
    if (checkCpf.rowCount > 0) {
      return res.sendStatus(409);
    }
    const updatecustomer = await db.query(
      "UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5",
      [name, phone, cpf, birthday, id]
    );
    if (updatecustomer.rowCount === 0) {
      return res.sendStatus(404);
    }
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
