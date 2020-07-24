import pool from "../../db";
import { BadRequest, GeneralError } from "../../utils";
import bcrypt from "bcrypt";

export const loginService = async (
  email: string,
  password: string
): Promise<{ success: boolean; id?: number }> => {
  const client = await pool.connect();

  if (!email || !password) throw new BadRequest("login Query invalid input");
  try {
    const res = await client.query(
      `SELECT
                id,
                pwd_hash as "pwdHash"
            FROM progresser_user
            WHERE email=$1`,
      [email]
    );

    if (!res.rows.length)
      throw new BadRequest("login Query no user with given email");

    const { id, pwdHash } = res.rows[0];

    if (bcrypt.compareSync(password, pwdHash)) {
      return { success: true, id };
    } else {
      return { success: false };
    }
  } catch (error) {
    throw new GeneralError(
      `login query resulted in database error: ${error.message}`
    );
  } finally {
    client.release();
  }
};

export const insertUserService = async (
  email: string,
  password: string
): Promise<number> => {
  const client = await pool.connect();

  if (!email || !password || email.length < 1 || password.length < 1)
    throw new BadRequest("insertUser Query invalid input.");

  try {
    const hash = bcrypt.hashSync(password, 12);

    const res = await client.query(
      `
            INSERT INTO "progresser_user" (email, pwd_hash)
            VALUES ($1, $2)
            RETURNING id`,
      [email, hash]
    );

    const { id } = res.rows[0];

    return id;
  } catch (error) {
    throw new GeneralError(
      `insertUser query resulted in database error: ${error.message}`
    );
  } finally {
    client.release();
  }
};

export const updateUserService = async (
  userId: number,
  email: string,
  password: string
): Promise<void> => {
  const client = await pool.connect();
  if (!userId || !email || !password)
    throw new BadRequest("updateUser Query invalid input");
  try {
    const hash = bcrypt.hashSync(password, 12);

    await client.query(
      `
            UPDATE progresser_user
            SET
                email = $2,
                pwd_hash = $3
            WHERE id = $1`,
      [userId, email, hash]
    );
  } catch (error) {
    throw new GeneralError(
      `updateUser query resulted in database error: ${error.message}`
    );
  } finally {
    client.release();
  }
};

export const deleteUserService = async (userId: number): Promise<void> => {
  const client = await pool.connect();

  if (!userId) throw new BadRequest("deleteUser Query invalid input");

  try {
    await client.query(
      `DELETE FROM progresser_user
            WHERE id = $1`,
      [userId]
    );
  } catch (error) {
    throw new GeneralError(
      `deleteUser query resulted in database error: ${error.message}`
    );
  } finally {
    client.release();
  }
};
