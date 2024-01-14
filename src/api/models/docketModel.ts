import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  Docket,
  GetDocket,
  PostDocket,
  PutDocket
} from '../../interfaces/Docket';

const getAllDockets = async (): Promise<Docket[]> => {
  const [rows] = await promisePool.execute<GetDocket[]>(
    `SELECT *
    FROM dockets`
  );
  if (rows.length === 0) {
    throw new CustomError('No dockets found', 404);
  }
  return rows;
};

const getDocket = async (id: string): Promise<Docket> => {
  const [rows] = await promisePool.execute<GetDocket[]>(
    `SELECT *
    FROM dockets
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('Docket not found', 404);
  }
  return rows[0];
};

const postDocket = async (docket: PostDocket) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO dockets (docketNumber, departureAt, transportOptionId, userId )
    VALUES (?, ?, ?, ?)`,
    [
      docket.docketNumber,
      docket.departureAt,
      docket.transportOptionId,
      docket.userId
    ]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Docket not created', 400);
  }
  return headers.insertId;
};

const putDocket = async (data: PutDocket, id: number): Promise<boolean> => {
  const sql = promisePool.format('UPDATE dockets SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Docket not updated', 400);
  }

  return true;
};

const deleteDocket = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM dockets WHERE id = ?;', [id]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Docket not deleted', 400);
  }

  return true;
};

export { getAllDockets, getDocket, postDocket, putDocket, deleteDocket };
