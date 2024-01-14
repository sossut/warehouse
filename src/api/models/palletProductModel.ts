import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetPalletProduct,
  PostPalletProduct,
  PutPalletProduct,
  PalletProduct
} from '../../interfaces/PalletProduct';

const getAllPalletProducts = async (): Promise<PalletProduct[]> => {
  const [rows] = await promisePool.execute<GetPalletProduct[]>(
    `SELECT *
    FROM PalletProducts`
  );
  if (rows.length === 0) {
    throw new CustomError('No PalletProducts found', 404);
  }
  return rows;
};

const getPalletProduct = async (id: string): Promise<PalletProduct> => {
  const [rows] = await promisePool.execute<GetPalletProduct[]>(
    `SELECT *
    FROM PalletProducts
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('PalletProduct not found', 404);
  }
  return rows[0];
};

const getPalletProductsIdsByPalletId = async (
  id: number
): Promise<PalletProduct[]> => {
  const [rows] = await promisePool.execute<GetPalletProduct[]>(
    `SELECT id
    FROM PalletProducts
    WHERE palletId = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('PalletProduct not found', 404);
  }
  return rows;
};

const postPalletProduct = async (palletProduct: PostPalletProduct) => {
  const sql = promisePool.format(
    `INSERT INTO PalletProducts (palletId, productId, quantity)
    VALUES (?, ?, ?)`,
    [palletProduct.palletId, palletProduct.productId, palletProduct.quantity]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('PalletProduct not created', 400);
  }
  return headers.insertId;
};

const putPalletProduct = async (
  data: PutPalletProduct,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format('UPDATE PalletProducts SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('PalletProduct not updated', 400);
  }

  return true;
};

const deletePalletProduct = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM PalletProducts WHERE id = ?;', [
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('PalletProduct not found', 404);
  }

  return true;
};

const deletePalletProductByPalletId = async (
  palletId: number
): Promise<boolean> => {
  const sql = promisePool.format(
    'DELETE FROM PalletProducts WHERE palletId = ?;',
    [palletId]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('PalletProduct not found', 404);
  }

  return true;
};

export {
  getAllPalletProducts,
  getPalletProduct,
  getPalletProductsIdsByPalletId,
  postPalletProduct,
  putPalletProduct,
  deletePalletProduct,
  deletePalletProductByPalletId
};
