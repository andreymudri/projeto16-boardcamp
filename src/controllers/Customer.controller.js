import db from "../database/database.js";
import dayjs from "dayjs";
export async function GetCustomer(req, res) {
  const paramID = req.params.id;
  let customer;
  try {
    if (!paramID) {
      customer = await db.query("SELECT * FROM customers");
      const customersWithFormattedBirthday = customer.rows.map((customer) => {
        return {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          cpf: customer.cpf,
          birthday: dayjs(customer.birthday).format("YYYY-MM-DD"),
        };
      });

      res.status(200).send(customersWithFormattedBirthday);
    } else {
      customer = await db.query("SELECT * FROM customers WHERE id = $1", [
        paramID,
      ]);
      if (customer.rows.length > 0) {
        const formattedCustomer = {
          id: customer.rows[0].id,
          name: customer.rows[0].name,
          phone: customer.phone,
          cpf: customer.cpf,
          birthday: dayjs(customer.rows[0].birthday).format("YYYY-MM-DD"),
        };
        res.send(formattedCustomer);
      } else {
        res.sendStatus(404);
      }
    }
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
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
