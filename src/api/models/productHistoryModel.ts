import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  ProductHistory,
  GetProductHistory,
  PostProductHistory,
  PutProductHistory
} from '../../interfaces/ProductHistory';

const getAllProductHistories = async (): Promise<ProductHistory[]> => {
  const [rows] = await promisePool.execute<GetProductHistory[]>(
    'SELECT * FROM ProductHistories'
  );
  if (rows.length === 0) {
    throw new CustomError('No ProductHistories found', 404);
  }
  return rows;
};

const getProductHistory = async (id: string): Promise<ProductHistory> => {
  const [rows] = await promisePool.execute<GetProductHistory[]>(
    `SELECT *
    FROM ProductHistories
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('ProductHistory not found', 404);
  }
  return rows[0];
};

const getProductHistoryByProductId = async (
  id: number
): Promise<ProductHistory[]> => {
  const [rows] = await promisePool.execute<GetProductHistory[]>(
    `SELECT *
    FROM ProductHistories
    WHERE productId = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('ProductHistory not found', 404);
  }
  return rows;
};

const postProductHistoryArrive = async (productHistory: PostProductHistory) => {
  const sql = promisePool.format(
    `INSERT INTO ProductHistories (productId, quantity, inDocketId)
    VALUES (?, ?, ?)`,
    [
      productHistory.productId,
      productHistory.quantity,
      productHistory.inDocketId
    ]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('ProductHistory not created', 400);
  }
  return headers.insertId;
};

const postProductHistoryLeave = async (productHistory: PostProductHistory) => {
  const sql = promisePool.format(
    `INSERT INTO ProductHistories (productId, quantity, outDocketId)
    VALUES (?, ?, ?)`,
    [
      productHistory.productId,
      productHistory.quantity,
      productHistory.outDocketId
    ]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('ProductHistory not created', 400);
  }
  return headers.insertId;
};

const postProductHistoryManual = async (productHistory: PostProductHistory) => {
  const sql = promisePool.format(
    `INSERT INTO ProductHistories (productId, quantity, manual)
    VALUES (?, ?, ?)`,
    [productHistory.productId, productHistory.quantity, productHistory.manual]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('ProductHistory not created', 400);
  }
  return headers.insertId;
};

const postProductHistoryLeaveManual = async (
  productHistory: PostProductHistory
) => {
  const sql = promisePool.format(
    `INSERT INTO ProductHistories (productId, quantity, manual, outDocketId)
    VALUES (?, ?, ?, ?)`,
    [
      productHistory.productId,
      productHistory.quantity,
      productHistory.manual,
      productHistory.outDocketId
    ]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('ProductHistory not created', 400);
  }
  return headers.insertId;
};

const putProductHistory = async (
  data: PutProductHistory,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format(
    'UPDATE ProductHistories SET ? WHERE id = ?;',
    [data, id]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('ProductHistory not updated', 400);
  }

  return true;
};

const deleteProductHistory = async (id: number): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM ProductHistories
    WHERE id = ?`,
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('ProductHistory not found', 404);
  }
  return true;
};

export {
  getAllProductHistories,
  getProductHistory,
  getProductHistoryByProductId,
  postProductHistoryArrive,
  postProductHistoryLeave,
  postProductHistoryManual,
  postProductHistoryLeaveManual,
  putProductHistory,
  deleteProductHistory
};
