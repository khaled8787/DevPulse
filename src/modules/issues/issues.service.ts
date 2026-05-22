import pool from "../../config/db";
import { ICreateIssue } from "../../interfaces/issues.interface";
import { QueryResult } from "pg";

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


export const getAllIssuesFromDB = async (
  query: Record<string, unknown>
) => {
  let sql = `SELECT * FROM issues`;

  const conditions: string[] = [];
  const values: string[] = [];

  // filtering
  if (query.type) {
    values.push(query.type as string);

    conditions.push(`type = $${values.length}`);
  }

  if (query.status) {
    values.push(query.status as string);

    conditions.push(`status = $${values.length}`);
  }

  // add WHERE
  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(" AND ");
  }

  // sorting
  if (query.sort === "oldest") {
    sql += ` ORDER BY created_at ASC`;
  } else {
    sql += ` ORDER BY created_at DESC`;
  }

  // fetch issues
  const issuesResult: QueryResult = await pool.query(
    sql,
    values
  );

  const issues = issuesResult.rows;

  // extract reporter ids
  const reporterIds = [
    ...new Set(issues.map((issue) => issue.reporter_id)),
  ];

  // get users without JOIN
  let users = [];

  if (reporterIds.length > 0) {
    const usersResult = await pool.query(
      `
      SELECT id, name, role
      FROM users
      WHERE id = ANY($1)
      `,
      [reporterIds]
    );

    users = usersResult.rows;
  }

  // map reporter
  const formattedIssues = issues.map((issue) => {
    const reporter = users.find(
      (user) => user.id === issue.reporter_id
    );

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,

      reporter: reporter || null,

      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });

  return formattedIssues;
};