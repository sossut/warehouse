import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetProduct,
  PostProduct,
  PutProduct,
  Product
} from '../../interfaces/Product';

const getAllProducts = async (): Promise<Product[]> => {
  const [rows] = await promisePool.execute<GetProduct[]>(
    `SELECT *
    FROM products
    ORDER BY code`
  );
  if (rows.length === 0) {
    throw new CustomError('No products found', 404);
  }
  return rows;
};

const getProduct = async (id: string): Promise<Product> => {
  const [rows] = await promisePool.execute<GetProduct[]>(
    `SELECT *
    FROM products
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('Product not found', 404);
  }
  return rows[0];
};

const getProductByCode = async (code: string): Promise<Product> => {
  const [rows] = await promisePool.execute<GetProduct[]>(
    `SELECT *
    FROM products
    WHERE code = ?`,
    [code]
  );
  if (rows.length === 0) {
    throw new CustomError('Product not found', 404);
  }
  return rows[0];
};

const postProduct = async (product: PostProduct) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO products (name, code, weight, quantityOptionId, updatedAt)
    VALUES (?, ?, ?, ?, ?)`,
    [
      product.name,
      product.code,
      product.weight,
      product.quantityOptionId,
      product.updatedAt
    ]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Product not created', 400);
  }
  return headers.insertId;
};

const putProduct = async (data: PutProduct, id: number): Promise<Product> => {
  const sql = promisePool.format('UPDATE products SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Product not updated', 400);
  }
  const product = await getProduct(id.toString());

  return product;
};

const deleteProduct = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM products WHERE id = ?;', [id]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Product not deleted', 400);
  }

  return true;
};

export {
  getAllProducts,
  getProduct,
  getProductByCode,
  postProduct,
  putProduct,
  deleteProduct
};
