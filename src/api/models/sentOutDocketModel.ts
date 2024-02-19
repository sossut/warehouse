import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  SentOutDocket,
  GetSentOoutDocket,
  PostSentOutDocket,
  PutSentOutDocket
} from '../../interfaces/SentOutDocket';

const getAllSentOutDockets = async (): Promise<SentOutDocket[]> => {
  const [rows] = await promisePool.execute<GetSentOoutDocket[]>(
    `SELECT 
       * FROM SentOutDockets`
  );
  if (rows.length === 0) {
    throw new CustomError('No SentOutDockets found', 404);
  }
  const SentOutDockets = rows.map((row) => ({
    ...row
  }));
  return SentOutDockets;
};

const getSentOutDocket = async (id: string): Promise<SentOutDocket> => {
  const [rows] = await promisePool.execute<GetSentOoutDocket[]>(
    `SELECT
      * FROM SentOutDockets WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No SentOutDocket found', 404);
  }
  return rows[0];
};

const postSentOutDocket = async (
  sentOutDocket: PostSentOutDocket
): Promise<ResultSetHeader> => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO SentOutDockets VALUES (?)',
    [sentOutDocket]
  );
  return result;
};

const putSentOutDocket = async (
  id: string,
  sentOutDocket: PutSentOutDocket
): Promise<ResultSetHeader> => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    'UPDATE SentOutDockets SET ? WHERE id = ?',
    [sentOutDocket, id]
  );
  return result;
};

const deleteSentOutDocket = async (id: string): Promise<ResultSetHeader> => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM SentOutDockets WHERE id = ?',
    [id]
  );
  return result;
};

export {
  getAllSentOutDockets,
  getSentOutDocket,
  postSentOutDocket,
  putSentOutDocket,
  deleteSentOutDocket
};
