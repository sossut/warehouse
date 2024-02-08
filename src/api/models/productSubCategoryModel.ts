import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetProductSubCategory,
  PostProductSubCategory,
  PutProductSubCategory,
  ProductSubCategory
} from '../../interfaces/ProductSubCategory';

const getAllProductSubCategories = async (): Promise<ProductSubCategory[]> => {
  const [rows] = await promisePool.execute<GetProductSubCategory[]>(
    `SELECT *
    FROM productSubCategories`
  );
  if (rows.length === 0) {
    throw new CustomError('No productSubCategories found', 404);
  }
  return rows;
};

const getProductSubCategory = async (
  id: string
): Promise<ProductSubCategory> => {
  const [rows] = await promisePool.execute<GetProductSubCategory[]>(
    `SELECT *
    FROM productSubCategories
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('ProductSubCategory not found', 404);
  }
  return rows[0];
};

const postProductSubCategory = async (
  productSubCategory: PostProductSubCategory
) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO productSubCategories (name, categoryId)
    VALUES (?, ?)`,
    [productSubCategory.name, productSubCategory.productCategoryId]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('ProductSubCategory not created', 400);
  }
  return headers.insertId;
};

const putProductSubCategory = async (
  data: PutProductSubCategory,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format(
    'UPDATE productSubCategories SET ? WHERE id = ?;',
    [data, id]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('ProductSubCategory not updated', 400);
  }

  return true;
};

const deleteProductSubCategory = async (id: number): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM productSubCategories
    WHERE id = ?`,
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('ProductSubCategory not deleted', 400);
  }
  return true;
};

export {
  getAllProductSubCategories,
  getProductSubCategory,
  postProductSubCategory,
  putProductSubCategory,
  deleteProductSubCategory
};
