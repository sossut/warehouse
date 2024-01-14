import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  TransportOption,
  GetTransportOption,
  PostTransportOption,
  PutTransportOption
} from '../../interfaces/TransportOption';

const getAllTransportOptions = async (): Promise<TransportOption[]> => {
  const [rows] = await promisePool.execute<GetTransportOption[]>(
    `SELECT *
    FROM transportOptions`
  );
  if (rows.length === 0) {
    throw new CustomError('No transportOptions found', 404);
  }
  return rows;
};

const getTransportOption = async (id: string): Promise<TransportOption> => {
  const [rows] = await promisePool.execute<GetTransportOption[]>(
    `SELECT *
    FROM transportOptions
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('TransportOption not found', 404);
  }
  return rows[0];
};

const postTransportOption = async (transportOption: PostTransportOption) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO transportOptions (transportOption)
    VALUES (?)`,
    [transportOption.transportOption]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('TransportOption not created', 400);
  }
  return headers.insertId;
};

const putTransportOption = async (
  data: PutTransportOption,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format(
    'UPDATE transportOptions SET ? WHERE id = ?;',
    [data, id]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('TransportOption not updated', 400);
  }

  return true;
};

const deleteTransportOption = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM transportOptions WHERE id = ?;', [
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('TransportOption not deleted', 400);
  }

  return true;
};

export {
  getAllTransportOptions,
  getTransportOption,
  postTransportOption,
  putTransportOption,
  deleteTransportOption
};
