import express from "express";
import { Pool } from "pg";
import crypto from "node:crypto";
import cors from "cors";

const makeId = () => crypto.randomBytes(16).toString("hex");
const initialUserBalance = 100000;
const dbUser = Bun.env.POSTGRES_USER;
const dbPassword = Bun.env.POSTGRES_PASSWORD;
const dbHost = Bun.env.POSTGRES_HOST;
const dbPort = Bun.env.POSTGRES_PORT;
const dbName = Bun.env.POSTGRES_DB_NAME;

// Bail if any of the env variables are missing.
if (!dbUser || !dbPassword || !dbHost || !dbPort || !dbName) {
  throw new Error("Postgres credentials details are required");
}

// Setup express app with cors
const app = express();
app.use(cors());
app.use(express.json());

// Connect to postgres using creds from above.
const pool = new Pool({
  user: dbUser,
  password: dbPassword,
  host: dbHost,
  port: Number(dbPort),
  database: dbName,
});

// Create an initial table for users.
pool
  .query(
    `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    balance INTEGER NOT NULL
  );
`
  )
  .then(() => {
    console.log("Users table created successfully");
  })
  .catch((error) => {
    console.error("Error creating users table:", error);
    throw error;
  });

// This end point creates a new user.
// All users start with 100k tokens as initial balance.
app.post("/api/createuser", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing name" });
    }
    const userId = makeId();

    await pool.query(
      "INSERT INTO users (id, name, balance) VALUES ($1, $2, $3)",
      [userId, name, initialUserBalance]
    );

    res.status(201).json({ id: userId, name, balance: initialUserBalance });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// This end point returns userinfo for a given userid.
app.get("/api/getuser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// This endpoint returns a list of all users in the db
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, balance FROM users");
    const users = result.rows;
    res.json(users);
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// This endpoint sends amount between users
app.post("/api/send", async (req, res) => {
  try {
    const { id } = req.body;
    const { receiverId, amount } = req.body;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const senderResult = await client.query(
        "SELECT * FROM users WHERE id = $1 FOR UPDATE",
        [id]
      );
      const sender = senderResult.rows[0];

      if (!sender) {
        return res.status(404).json({ error: "Sender not found" });
      }

      const receiverResult = await client.query(
        "SELECT * FROM users WHERE id = $1 FOR UPDATE",
        [receiverId]
      );
      const receiver = receiverResult.rows[0];

      if (!receiver) {
        return res.status(404).json({ error: "Receiver not found" });
      }

      if (sender.balance < amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      await client.query(
        "UPDATE users SET balance = balance - $1 WHERE id = $2",
        [amount, id]
      );
      await client.query(
        "UPDATE users SET balance = balance + $1 WHERE id = $2",
        [amount, receiverId]
      );

      await client.query("COMMIT");

      res.json({ message: "Tokens sent successfully" });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error sending tokens:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
