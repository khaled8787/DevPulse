import pool from "../../config/db";
import { ICreateIssue } from "../../interfaces/issues.interface";

export const createIssueIntoDB = async (
  payload: ICreateIssue,
  userId: number
) => {
  const { title, description, type } = payload;

  // validation
  if (!title || !description || !type) {
    throw new Error("All fields are required");
  }

  if (description.length < 20) {
    throw new Error(
      "Description must be at least 20 characters"
    );
  }

  const result = await pool.query(
    `
    INSERT INTO issues 
    (title, description, type, reporter_id)
    
    VALUES ($1, $2, $3, $4)

    RETURNING *
    `,
    [title, description, type, userId]
  );

  return result.rows[0];
};