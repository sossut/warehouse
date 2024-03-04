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
       SentOutDockets.id, SentOutDockets.departureAt, SentOutDockets.transportOptionId, SentOutDockets.userId,  SentOutDockets.createdAt, SentOutDockets.status, SentOutDockets.parcels,
       OutDockets.docketNumber,
       CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
            'id', products.id,
            'name', products.name,
            'code', products.code,
            'weight', products.weight,
            'orderedProductQuantity', SentOutDocketProducts.orderedProductQuantity,
            'deliveredProductQuantity', SentOutDocketProducts.deliveredProductQuantity,
            'quantityOption', JSON_OBJECT('id', products.quantityOptionId, 'quantityOption', quantityOptions.quantityOption)
          )), ']') AS products,
       JSON_OBJECT('id', transportOptions.id, 'transportOption', transportOptions.transportOption) AS transportOption,
       JSON_OBJECT(
         'id', clients.id,
         'name', clients.name
         ) AS client
         FROM SentOutDockets
         LEFT JOIN TransportOptions ON SentOutDockets.transportOptionId = TransportOptions.id
         LEFT JOIN clients ON SentOutDockets.clientId = clients.id
         LEFT JOIN SentOutDocketProducts ON SentOutDockets.id = SentOutDocketProducts.SentOutDocketId
         LEFT JOIN products ON SentOutDocketProducts.productId = products.id
         LEFT JOIN quantityOptions ON products.quantityOptionId = quantityOptions.id
         LEFT JOIN OutDockets ON SentOutDockets.docketId = OutDockets.id
         GROUP BY SentOutDockets.id`
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
       SentOutDockets.id, SentOutDockets.departureAt, SentOutDockets.transportOptionId, SentOutDockets.userId,  SentOutDockets.createdAt, SentOutDockets.status, SentOutDockets.parcels,
       OutDockets.docketNumber,
       CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
            'id', products.id,
            'name', products.name,
            'code', products.code,
            'weight', products.weight,
            'orderedProductQuantity', SentOutDocketProducts.orderedProductQuantity,
            'deliveredProductQuantity', SentOutDocketProducts.deliveredProductQuantity,
            'quantityOption', JSON_OBJECT('id', products.quantityOptionId, 'quantityOption', quantityOptions.quantityOption)
          )), ']') AS products,
       JSON_OBJECT('id', transportOptions.id, 'transportOption', transportOptions.transportOption) AS transportOption,
       JSON_OBJECT(
         'id', clients.id,
         'name', clients.name
         ) AS client
         FROM SentOutDockets
         LEFT JOIN TransportOptions ON SentOutDockets.transportOptionId = TransportOptions.id
         LEFT JOIN clients ON SentOutDockets.clientId = clients.id
         LEFT JOIN SentOutDocketProducts ON SentOutDockets.id = SentOutDocketProducts.SentOutDocketId
         LEFT JOIN products ON SentOutDocketProducts.productId = products.id
         LEFT JOIN quantityOptions ON products.quantityOptionId = quantityOptions.id
         LEFT JOIN OutDockets ON SentOutDockets.docketId = OutDockets.id
         WHERE SentOutDockets.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No SentOutDocket found', 404);
  }
  return rows[0];
};

const postSentOutDocket = async (sentOutDocket: PostSentOutDocket) => {
  console.log(sentOutDocket);
  const [result] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO SentOutDockets (departureAt, docketId, transportOptionId, userId, parcels) VALUES (?, ?, ?, ?, ?)',
    [
      sentOutDocket.departureAt,
      sentOutDocket.docketId,
      sentOutDocket.transportOptionId,
      sentOutDocket.userId,
      sentOutDocket.parcels
      // sentOutDocket.status
    ]
  );
  if (result.affectedRows === 0) {
    throw new CustomError('SentOutDocket not posted', 404);
  }
  return result.insertId;
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
