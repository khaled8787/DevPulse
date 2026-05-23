import pool from "../../config/db";
import { ICreateIssue } from "../../interfaces/issues.interface";
import { QueryResult } from "pg";

export const createIssueIntoDB = async (
  payload: ICreateIssue,
  userId: number
) => {
  const { title, description, type } = payload;

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

  if (query.type) {
    values.push(query.type as string);

    conditions.push(`type = $${values.length}`);
  }

  if (query.status) {
    values.push(query.status as string);

    conditions.push(`status = $${values.length}`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(" AND ");
  }

  if (query.sort === "oldest") {
    sql += ` ORDER BY created_at ASC`;
  } else {
    sql += ` ORDER BY created_at DESC`;
  }

  const issuesResult: QueryResult = await pool.query(
    sql,
    values
  );

  const issues = issuesResult.rows;

  const reporterIds = [
    ...new Set(issues.map((issue) => issue.reporter_id)),
  ];

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


export const getSingleIssueFromDB = async (
  issueId: number
) => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [issueId]
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

  const reporterResult = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = $1
    `,
    [issue.reporter_id]
  );

  const reporter = reporterResult.rows[0];

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,

    reporter,

    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

interface IUserPayload {
  id: number;
  name: string;
  role: string;
}
export const updateIssueIntoDB = async (
  issueId: number,
  payload: Partial<ICreateIssue>,
  user: IUserPayload
) => {
  const existingIssueResult = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [issueId]
  );

  const existingIssue = existingIssueResult.rows[0];

  if (!existingIssue) {
    throw new Error("Issue not found");
  }

  if (user.role === "contributor") {
    if (existingIssue.reporter_id !== user.id) {
      throw new Error(
        "You can only update your own issue"
      );
    }

    if (existingIssue.status !== "open") {
      throw new Error(
        "You cannot update non-open issues"
      );
    }
  }

  const updatedTitle =
    payload.title || existingIssue.title;

  const updatedDescription =
    payload.description ||
    existingIssue.description;

  const updatedType =
    payload.type || existingIssue.type;

  const result = await pool.query(
    `
    UPDATE issues

    SET
      title = $1,
      description = $2,
      type = $3,
      updated_at = CURRENT_TIMESTAMP

    WHERE id = $4

    RETURNING *
    `,
    [
      updatedTitle,
      updatedDescription,
      updatedType,
      issueId,
    ]
  );

  return result.rows[0];
};


export const deleteIssueFromDB = async (
  issueId: number
) => {
  const existingIssue = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [issueId]
  );

  if (existingIssue.rows.length === 0) {
    throw new Error("Issue not found");
  }

  await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1
    `,
    [issueId]
  );
};