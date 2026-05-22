import bcrypt from "bcrypt";
import pool from "../../config/db";

export const signupUser = async (payload: any) => {
  const { name, email, password, role } = payload;

  // 1. check existing user
  const existing = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existing.rows.length > 0) {
    throw new Error("Email already exists");
  }

  // 2. hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. insert user
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, role || "contributor"]
  );

  return result.rows[0];
};