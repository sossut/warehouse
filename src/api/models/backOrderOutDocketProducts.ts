import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  BackOrderOutDocketProduct,
  GetBackOrderOutDocketProduct,
  PostBackOrderOutDocketProduct,
  PutBackOrderOutDocketProduct
} from '../../interfaces/BackOrderOutDocketProduct';

const getAllBackOrderOutDocketProducts = async (): Promise<
  BackOrderOutDocketProduct[]
> => {
  const [rows] = await promisePool.execute<GetBackOrderOutDocketProduct[]>(
    `SELECT *
    FROM BackOrderOutDocketProducts`
  );
  if (rows.length === 0) {
    throw new CustomError('No BackOrderOutDocketProducts found', 404);
  }
  return rows;
};

const getBackOrderOutDocketProduct = async (
  id: string
): Promise<BackOrderOutDocketProduct> => {
  const [rows] = await promisePool.execute<GetBackOrderOutDocketProduct[]>(
    `SELECT *
    FROM BackOrderOutDocketProducts
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('BackOrderOutDocketProduct not found', 404);
  }
  return rows[0];
};

const getBackOrderOutDocketProductsIdsByOutDocketId = async (
  id: number
): Promise<BackOrderOutDocketProduct[]> => {
  const [rows] = await promisePool.execute<GetBackOrderOutDocketProduct[]>(
    `SELECT id
    FROM BackOrderOutDocketProducts
    WHERE OutDocketId = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('BackOrderOutDocketProduct not found', 404);
  }
  return rows;
};

const postBackOrderOutDocketProduct = async (
  backOrderOutDocketProduct: PostBackOrderOutDocketProduct
) => {
  const sql = promisePool.format(
    `INSERT INTO BackOrderOutDocketProducts (productId, backOrderOutDocketId, orderedProductQuantity, deliveredProductQuantity)
    VALUES (?, ?, ?, ?)`,
    [
      backOrderOutDocketProduct.productId,
      backOrderOutDocketProduct.backOrderOutDocketId,
      backOrderOutDocketProduct.orderedProductQuantity,
      backOrderOutDocketProduct.deliveredProductQuantity
    ]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('BackOrderOutDocketProduct not created', 400);
  }
  return headers.insertId;
};

const putBackOrderOutDocketProduct = async (
  data: PutBackOrderOutDocketProduct,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format(
    'UPDATE BackOrderOutDocketProducts SET ? WHERE id = ?;',
    [data, id]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('BackOrderOutDocketProduct not updated', 400);
  }

  return true;
};

const deleteBackOrderOutDocketProduct = async (
  id: number
): Promise<boolean> => {
  const sql = promisePool.format(
    'DELETE FROM BackOrderOutDocketProducts WHERE id = ?;',
    [id]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('BackOrderOutDocketProduct not found', 404);
  }

  return true;
};

export {
  getAllBackOrderOutDocketProducts,
  getBackOrderOutDocketProduct,
  getBackOrderOutDocketProductsIdsByOutDocketId,
  postBackOrderOutDocketProduct,
  putBackOrderOutDocketProduct,
  deleteBackOrderOutDocketProduct
};
