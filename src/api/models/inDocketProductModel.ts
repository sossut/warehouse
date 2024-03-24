import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  InDocketProduct,
  GetInDocketProduct,
  PostInDocketProduct,
  PutInDocketProduct
} from '../../interfaces/InDocketProduct';

const getAllInDocketProducts = async (): Promise<InDocketProduct[]> => {
  const [rows] = await promisePool.execute<GetInDocketProduct[]>(
    `SELECT *
    FROM InDocketProducts`
  );
  if (rows.length === 0) {
    throw new CustomError('No InDocketProducts found', 404);
  }
  return rows;
};

const getInDocketProduct = async (id: string): Promise<InDocketProduct> => {
  const [rows] = await promisePool.execute<GetInDocketProduct[]>(
    `SELECT *
    FROM InDocketProducts
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('InDocketProduct not found', 404);
  }
  return rows[0];
};

const getInDocketProductsIdsByInDocketId = async (
  id: number
): Promise<InDocketProduct[]> => {
  const [rows] = await promisePool.execute<GetInDocketProduct[]>(
    `SELECT id
    FROM InDocketProducts
    WHERE InDocketId = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('InDocketProduct not found', 404);
  }
  return rows;
};

const postInDocketProduct = async (inDocketProduct: PostInDocketProduct) => {
  const sql = promisePool.format(
    `INSERT INTO InDocketProducts (productId, InDocketId, orderedProductQuantity, receivedProductQuantity)
    VALUES (?, ?, ?, ?)`,
    [
      inDocketProduct.productId,
      inDocketProduct.inDocketId,
      inDocketProduct.orderedProductQuantity,
      inDocketProduct.receivedProductQuantity
    ]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('InDocketProduct not created', 400);
  }
  return headers.insertId;
};

const putInDocketProduct = async (
  data: PutInDocketProduct,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format(
    'UPDATE InDocketProducts SET ? WHERE id = ?;',
    [data, id]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('InDocketProduct not updated', 400);
  }

  return true;
};

const deleteInDocketProduct = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM InDocketProducts WHERE id = ?;', [
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('InDocketProduct not found', 404);
  }

  return true;
};

export {
  getAllInDocketProducts,
  getInDocketProduct,
  getInDocketProductsIdsByInDocketId,
  postInDocketProduct,
  putInDocketProduct,
  deleteInDocketProduct
};
