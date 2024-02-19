import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  SentOutDocketProduct,
  GetSentOutDocketProduct,
  PostSentOutDocketProduct,
  PutSentOutDocketProduct
} from '../../interfaces/SentOutDocketProduct';

const getAllSentOutDocketProducts = async (): Promise<
  SentOutDocketProduct[]
> => {
  const [rows] = await promisePool.execute<GetSentOutDocketProduct[]>(
    `SELECT 
       * FROM SentOutDocketProducts`
  );
  if (rows.length === 0) {
    throw new CustomError('No SentOutDocketProducts found', 404);
  }
  const SentOutDocketProducts = rows.map((row) => ({
    ...row
  }));
  return SentOutDocketProducts;
};

const getSentOutDocketProduct = async (
  id: string
): Promise<SentOutDocketProduct> => {
  const [rows] = await promisePool.execute<GetSentOutDocketProduct[]>(
    `SELECT
      * FROM SentOutDocketProducts WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No SentOutDocketProduct found', 404);
  }
  return rows[0];
};

const postSentOutDocketProduct = async (
  sentOutDocketProduct: PostSentOutDocketProduct
): Promise<ResultSetHeader> => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO SentOutDocketProducts SET ?',
    [sentOutDocketProduct]
  );
  return result;
};

const putSentOutDocketProduct = async (
  id: string,
  sentOutDocketProduct: PutSentOutDocketProduct
): Promise<ResultSetHeader> => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    'UPDATE SentOutDocketProducts SET ? WHERE id = ?',
    [sentOutDocketProduct, id]
  );
  return result;
};

const deleteSentOutDocketProduct = async (
  id: string
): Promise<ResultSetHeader> => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM SentOutDocketProducts WHERE id = ?',
    [id]
  );
  return result;
};

export {
  getAllSentOutDocketProducts,
  getSentOutDocketProduct,
  postSentOutDocketProduct,
  putSentOutDocketProduct,
  deleteSentOutDocketProduct
};
