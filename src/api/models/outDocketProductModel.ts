import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  OutDocketProduct,
  GetOutDocketProduct,
  PostOutDocketProduct,
  PutOutDocketProduct
} from '../../interfaces/OutDocketProduct';

const getAllOutDocketProducts = async (): Promise<OutDocketProduct[]> => {
  const [rows] = await promisePool.execute<GetOutDocketProduct[]>(
    `SELECT *
    FROM OutDocketProducts`
  );
  if (rows.length === 0) {
    throw new CustomError('No OutDocketProducts found', 404);
  }
  return rows;
};

const getOutDocketProduct = async (id: string): Promise<OutDocketProduct> => {
  const [rows] = await promisePool.execute<GetOutDocketProduct[]>(
    `SELECT *
    FROM OutDocketProducts
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('OutDocketProduct not found', 404);
  }
  return rows[0];
};

const getOutDocketProductsIdsByOutDocketId = async (
  id: number
): Promise<OutDocketProduct[]> => {
  const [rows] = await promisePool.execute<GetOutDocketProduct[]>(
    `SELECT id
    FROM OutDocketProducts
    WHERE OutDocketId = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('OutDocketProduct not found', 404);
  }
  return rows;
};

const postOutDocketProduct = async (outDocketProduct: PostOutDocketProduct) => {
  const sql = promisePool.format(
    `INSERT INTO OutDocketProducts (productId, OutDocketId, orderedProductQuantity, deliveredProductQuantity)
    VALUES (?, ?, ?, ?)`,
    [
      outDocketProduct.productId,
      outDocketProduct.outDocketId,
      outDocketProduct.orderedProductQuantity,
      outDocketProduct.deliveredProductQuantity
    ]
  );
  console.log(sql);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('OutDocketProduct not created', 400);
  }
  return headers.insertId;
};

const putOutDocketProduct = async (
  data: PutOutDocketProduct,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format(
    'UPDATE OutDocketProducts SET ? WHERE id = ?;',
    [data, id]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('OutDocketProduct not updated', 400);
  }

  return true;
};

const deleteOutDocketProduct = async (id: number): Promise<boolean> => {
  const sql = promisePool.format(
    'DELETE FROM OutDocketProducts WHERE id = ?;',
    [id]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('OutDocketProduct not deleted', 400);
  }

  return true;
};

const deleteOutDocketProductByOutDocketId = async (
  OutDocketId: number
): Promise<boolean> => {
  const sql = promisePool.format(
    'DELETE FROM OutDocketProducts WHERE OutDocketId = ?;',
    [OutDocketId]
  );
  console.log(sql);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('OutDocketProduct not found', 404);
  }

  return true;
};

export {
  getAllOutDocketProducts,
  getOutDocketProduct,
  getOutDocketProductsIdsByOutDocketId,
  postOutDocketProduct,
  putOutDocketProduct,
  deleteOutDocketProduct,
  deleteOutDocketProductByOutDocketId
};
