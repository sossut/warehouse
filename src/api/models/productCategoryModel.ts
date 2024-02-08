import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetProductCategory,
  PostProductCategory,
  PutProductCategory,
  ProductCategory
} from '../../interfaces/ProductCategory';

const getAllProductCategories = async (): Promise<ProductCategory[]> => {
  const [rows] = await promisePool.execute<GetProductCategory[]>(
    `SELECT *
    FROM productCategories`
  );
  if (rows.length === 0) {
    throw new CustomError('No productCategories found', 404);
  }
  return rows;
};

const getProductCategory = async (id: string): Promise<ProductCategory> => {
  const [rows] = await promisePool.execute<GetProductCategory[]>(
    `SELECT *
    FROM productCategories
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('ProductCategory not found', 404);
  }
  return rows[0];
};

const postProductCategory = async (productCategory: PostProductCategory) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO productCategories (name)
    VALUES (?)`,
    [productCategory.name]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('ProductCategory not created', 400);
  }
  return headers.insertId;
};

const putProductCategory = async (
  data: PutProductCategory,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format(
    'UPDATE productCategories SET ? WHERE id = ?;',
    [data, id]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('ProductCategory not updated', 400);
  }

  return true;
};

const deleteProductCategory = async (id: number): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM productCategories
    WHERE id = ?`,
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('ProductCategory not deleted', 400);
  }
  return true;
};

export {
  getAllProductCategories,
  getProductCategory,
  postProductCategory,
  putProductCategory,
  deleteProductCategory
};
