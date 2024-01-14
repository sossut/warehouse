import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  DocketProduct,
  GetDocketProduct,
  PostDocketProduct,
  PutDocketProduct
} from '../../interfaces/DocketProduct';

const getAllDocketProducts = async (): Promise<DocketProduct[]> => {
  const [rows] = await promisePool.execute<GetDocketProduct[]>(
    `SELECT *
    FROM DocketProducts`
  );
  if (rows.length === 0) {
    throw new CustomError('No DocketProducts found', 404);
  }
  return rows;
};

const getDocketProduct = async (id: string): Promise<DocketProduct> => {
  const [rows] = await promisePool.execute<GetDocketProduct[]>(
    `SELECT *
    FROM DocketProducts
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('DocketProduct not found', 404);
  }
  return rows[0];
};

const getDocketProductsIdsByDocketId = async (
  id: number
): Promise<DocketProduct[]> => {
  const [rows] = await promisePool.execute<GetDocketProduct[]>(
    `SELECT id
    FROM DocketProducts
    WHERE docketId = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('DocketProduct not found', 404);
  }
  return rows;
};

const postDocketProduct = async (docketProduct: PostDocketProduct) => {
  const sql = promisePool.format(
    `INSERT INTO DocketProducts (productId, docketId, productQuantity, quantityOptionId)
    VALUES (?, ?, ?, ?)`,
    [
      docketProduct.productId,
      docketProduct.docketId,
      docketProduct.productQuantity,
      docketProduct.quantityOptionId
    ]
  );
  console.log(sql);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('DocketProduct not created', 400);
  }
  return headers.insertId;
};

const putDocketProduct = async (
  data: PutDocketProduct,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format('UPDATE DocketProducts SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('DocketProduct not updated', 400);
  }

  return true;
};

const deleteDocketProduct = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM DocketProducts WHERE id = ?;', [
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('DocketProduct not deleted', 400);
  }

  return true;
};

const deleteDocketProductByDocketId = async (
  docketId: number
): Promise<boolean> => {
  const sql = promisePool.format(
    'DELETE FROM DocketProducts WHERE docketId = ?;',
    [docketId]
  );
  console.log(sql);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('DocketProduct not found', 404);
  }

  return true;
};

export {
  getAllDocketProducts,
  getDocketProduct,
  getDocketProductsIdsByDocketId,
  postDocketProduct,
  putDocketProduct,
  deleteDocketProduct,
  deleteDocketProductByDocketId
};
