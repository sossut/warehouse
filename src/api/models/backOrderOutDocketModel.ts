import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  BackOrderOutDocket,
  GetBackOrderOutDocket,
  PostBackOrderOutDocket,
  PutBackOrderOutDocket
} from '../../interfaces/BackOrderOutDocket';

const getAllBackOrderOutDockets = async (): Promise<BackOrderOutDocket[]> => {
  const [rows] = await promisePool.execute<GetBackOrderOutDocket[]>(
    `SELECT *
    FROM BackOrderOutDockets`
  );
  if (rows.length === 0) {
    throw new CustomError('No BackOrderOutDockets found', 404);
  }
  return rows;
};

const getBackOrderOutDocket = async (
  id: string
): Promise<BackOrderOutDocket> => {
  const [rows] = await promisePool.execute<GetBackOrderOutDocket[]>(
    `SELECT *
    FROM BackOrderOutDockets
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('BackOrderOutDocket not found', 404);
  }
  return rows[0];
};

const getBackOrderOutDocketsIdsByOutDocketId = async (
  id: number
): Promise<BackOrderOutDocket[]> => {
  const [rows] = await promisePool.execute<GetBackOrderOutDocket[]>(
    `SELECT id
    FROM BackOrderOutDockets
    WHERE OutDocketId = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('BackOrderOutDocket not found', 404);
  }
  return rows;
};

const postBackOrderOutDocket = async (
  backOrderOutDocket: PostBackOrderOutDocket
) => {
  const sql = promisePool.format(
    `INSERT INTO BackOrderOutDockets (docketId, transportOptionId, userId)
    VALUES (?, ?, ?, ?)`,
    [
      backOrderOutDocket.docketId,
      backOrderOutDocket.transportOptionId,
      backOrderOutDocket.userId
    ]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('BackOrderOutDocket not created', 400);
  }
  return headers.insertId;
};

const putBackOrderOutDocket = async (
  data: PutBackOrderOutDocket,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format(
    'UPDATE BackOrderOutDockets SET ? WHERE id = ?;',
    [data, id]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('BackOrderOutDocket not updated', 400);
  }

  return true;
};

const deleteBackOrderOutDocket = async (id: number): Promise<boolean> => {
  const sql = promisePool.format(
    'DELETE FROM BackOrderOutDockets WHERE id = ?;',
    [id]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('BackOrderOutDocket not found', 404);
  }

  return true;
};

export {
  getAllBackOrderOutDockets,
  getBackOrderOutDocket,
  getBackOrderOutDocketsIdsByOutDocketId,
  postBackOrderOutDocket,
  putBackOrderOutDocket,
  deleteBackOrderOutDocket
};
