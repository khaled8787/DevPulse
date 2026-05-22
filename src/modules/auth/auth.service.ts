import bcrypt from "bcrypt";
import pool from "../../config/db";
import { ISignupUser, ILoginUser } from "../../interfaces/auth.interface";
import jwt from "jsonwebtoken";

export const signupUser = async (payload: ISignupUser) => {
  const { name, email, password, role } = payload;

  // validation
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  // check existing email
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // insert user
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, email, hashedPassword, role || "contributor"]
  );

  return result.rows[0];
};


export const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  // check user exists
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // compare password
  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  // generate token
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};