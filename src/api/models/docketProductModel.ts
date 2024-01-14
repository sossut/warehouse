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

const postDocketProduct = async (docketProduct: PostDocketProduct) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO DocketProducts (productId, docketId, productQuantity, quantityOptionId)
    VALUES (?, ?, ?, ?, ?)`,
    [
      docketProduct.productId,
      docketProduct.docketId,
      docketProduct.productQuantity,
      docketProduct.quantityOptionId
    ]
  );
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

export {
  getAllDocketProducts,
  getDocketProduct,
  postDocketProduct,
  putDocketProduct,
  deleteDocketProduct
};
