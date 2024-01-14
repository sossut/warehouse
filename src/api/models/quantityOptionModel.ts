import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  GetQuantityOption,
  PostQuantityOption,
  PutQuantityOption,
  QuantityOption
} from '../../interfaces/QuantityOption';

const getAllQuantityOptions = async (): Promise<QuantityOption[]> => {
  const [rows] = await promisePool.execute<GetQuantityOption[]>(
    `SELECT *
    FROM quantityOptions`
  );
  if (rows.length === 0) {
    throw new CustomError('No quantityOptions found', 404);
  }
  return rows;
};

const getQuantityOption = async (id: string): Promise<QuantityOption> => {
  const [rows] = await promisePool.execute<GetQuantityOption[]>(
    `SELECT *
    FROM quantityOptions
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('QuantityOption not found', 404);
  }
  return rows[0];
};

const postQuantityOption = async (quantityOption: PostQuantityOption) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO quantityOptions (quantityOption)
    VALUES (?)`,
    [quantityOption.quantityOption]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('QuantityOption not created', 400);
  }
  return headers.insertId;
};

const putQuantityOption = async (
  data: PutQuantityOption,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format('UPDATE quantityOptions SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('QuantityOption not updated', 400);
  }

  return true;
};

const deleteQuantityOption = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM quantityOptions WHERE id = ?;', [
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('QuantityOption not found', 404);
  }

  return true;
};

export {
  getAllQuantityOptions,
  getQuantityOption,
  postQuantityOption,
  putQuantityOption,
  deleteQuantityOption
};
