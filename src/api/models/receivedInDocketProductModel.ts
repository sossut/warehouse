import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  ReceivedInDocketProduct,
  GetReceivedInDocketProduct,
  PostReceivedInDocketProduct,
  PutReceivedInDocketProduct
} from '../../interfaces/ReceivedInDocketProduct';

const getAllReceivedInDocketProducts = async (): Promise<
  ReceivedInDocketProduct[]
> => {
  const [rows] = await promisePool.execute<GetReceivedInDocketProduct[]>(
    `SELECT *
    FROM ReceivedInDocketProducts`
  );
  if (rows.length === 0) {
    throw new CustomError('No ReceivedInDocketProducts found', 404);
  }
  return rows;
};

const getReceivedInDocketProduct = async (
  id: string
): Promise<ReceivedInDocketProduct> => {
  const [rows] = await promisePool.execute<GetReceivedInDocketProduct[]>(
    `SELECT *
    FROM ReceivedInDocketProducts
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('ReceivedInDocketProduct not found', 404);
  }
  return rows[0];
};

const postReceivedInDocketProduct = async (
  receivedInDocketProduct: PostReceivedInDocketProduct
): Promise<ResultSetHeader> => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO ReceivedInDocketProducts (receivedInDocketId, productId, orderedProductQuantity, receivedProductQuantity)
    VALUES (?, ?, ?, ?)`,
    [
      receivedInDocketProduct.receivedInDocketId,
      receivedInDocketProduct.productId,
      receivedInDocketProduct.orderedProductQuantity,
      receivedInDocketProduct.receivedProductQuantity
    ]
  );
  return rows;
};

const putReceivedInDocketProduct = async (
  id: string,
  receivedInDocketProduct: PutReceivedInDocketProduct
): Promise<ResultSetHeader> => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    `UPDATE ReceivedInDocketProducts
    SET ?
    WHERE id = ?`,
    [receivedInDocketProduct, id]
  );
  return rows;
};

const deleteReceivedInDocketProduct = async (
  id: string
): Promise<ResultSetHeader> => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM ReceivedInDocketProducts
    WHERE id = ?`,
    [id]
  );
  return rows;
};

export {
  getAllReceivedInDocketProducts,
  getReceivedInDocketProduct,
  postReceivedInDocketProduct,
  putReceivedInDocketProduct,
  deleteReceivedInDocketProduct
};
