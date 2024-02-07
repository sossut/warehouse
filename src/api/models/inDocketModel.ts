import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';

import {
  InDocket,
  GetInDocket,
  PostInDocket,
  PutInDocket
} from '../../interfaces/InDocket';
import { ResultSetHeader } from 'mysql2';

const getAllInDockets = async (): Promise<InDocket[]> => {
  const [rows] = await promisePool.execute<GetInDocket[]>(
    `SELECT *
    FROM inDockets`
  );
  if (rows.length === 0) {
    throw new CustomError('No inDockets found', 404);
  }
  return rows;
};

const getInDocket = async (id: string): Promise<InDocket> => {
  const [rows] = await promisePool.execute<GetInDocket[]>(
    `SELECT *
    FROM inDockets
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('InDocket not found', 404);
  }
  return rows[0];
};

const postInDocket = async (inDocket: PostInDocket) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO inDockets (arrivalAt, transportOptionId, userId)
    VALUES (?, ?, ?, ?)`,
    [inDocket.arrivedAt, inDocket.userId, inDocket.vendorId, inDocket.filename]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('InDocket not created', 400);
  }
  return headers.insertId;
};

const putInDocket = async (data: PutInDocket, id: number): Promise<boolean> => {
  const sql = promisePool.format('UPDATE inDockets SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('InDocket not updated', 400);
  }

  return true;
};

const deleteInDocket = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM inDockets WHERE id = ?;', [id]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('InDocket not deleted', 400);
  }

  return true;
};

export {
  getAllInDockets,
  getInDocket,
  postInDocket,
  putInDocket,
  deleteInDocket
};
