import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  OutDocket,
  GetOutDocket,
  PostOutDocket,
  PutOutDocket
} from '../../interfaces/OutDocket';

const getAllOutDockets = async (): Promise<OutDocket[]> => {
  const [rows] = await promisePool.execute<GetOutDocket[]>(
    `SELECT 
       OutDockets.id, OutDockets.departureAt, OutDockets.transportOptionId, OutDockets.userId, OutDockets.docketNumber, OutDockets.createdAt, OutDockets.status,
       JSON_OBJECT('id', transportOptions.id, 'transportOption', transportOptions.transportOption) AS transportOption,
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
          'id', products.id,
          'name', products.name,
          'code', products.code,
          'weight', products.weight,
          'orderedProductQuantity', OutDocketProducts.orderedProductQuantity,
          'deliveredProductQuantity', OutDocketProducts.deliveredProductQuantity,
          'quantityOption', JSON_OBJECT('id', products.quantityOptionId, 'quantityOption', quantityOptions.quantityOption)
        )), ']') AS products,
      JSON_OBJECT(
        'id', clients.id,
        'name', clients.name
      ) AS client
    FROM OutDockets
    JOIN TransportOptions ON OutDockets.transportOptionId = TransportOptions.id
    JOIN OutDocketProducts ON OutDockets.id = OutDocketProducts.OutDocketId
    JOIN products ON OutDocketProducts.productId = products.id
    JOIN quantityOptions ON products.quantityOptionId = quantityOptions.id
    JOIN clients ON OutDockets.clientId = clients.id
    GROUP BY OutDockets.id`
  );
  if (rows.length === 0) {
    throw new CustomError('No OutDockets found', 404);
  }
  const OutDockets = rows.map((row) => ({
    ...row,
    products: JSON.parse(row.products?.toString() || '{}'),
    client: JSON.parse(row.client?.toString() || '{}'),
    transportOption: JSON.parse(row.transportOption?.toString() || '{}')
  }));
  return OutDockets;
};

const getOutDocket = async (id: string): Promise<OutDocket> => {
  const [rows] = await promisePool.execute<GetOutDocket[]>(
    `SELECT
      OutDockets.id, OutDockets.departureAt, OutDockets.transportOptionId, OutDockets.userId, OutDockets.docketNumber, OutDockets.createdAt, OutDockets.status,
      JSON_OBJECT('id', transportOptions.id, 'transportOption', transportOptions.transportOption) AS transportOption,
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
          'id', products.id,
          'name', products.name,
          'code', products.code,
          'weight', products.weight,
          'orderedQuantity', OutDocketProducts.orderedProductQuantity,
          'deliveredQuantity', OutDocketProducts.deliveredProductQuantity,
          'quantityOptionId', products.quantityOptionId
        )), ']') AS products,
      JSON_OBJECT(
        'id', clients.id,
        'name', clients.name
      ) AS client
    FROM OutDockets
    JOIN OutDocketProducts ON OutDockets.id = OutDocketProducts.OutDocketId
    JOIN TransportOptions ON OutDockets.transportOptionId = TransportOptions.id
    JOIN products ON OutDocketProducts.productId = products.id
    JOIN clients ON OutDockets.clientId = clients.id
    WHERE OutDockets.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('OutDocket not found', 404);
  }
  const OutDockets = rows.map((row) => ({
    ...row,
    products: JSON.parse(row.products?.toString() || '{}'),
    client: JSON.parse(row.client?.toString() || '{}'),
    transportOption: JSON.parse(row.transportOption?.toString() || '{}')
  }));
  return OutDockets[0];
};

const postOutDocket = async (outDocket: PostOutDocket) => {
  const sql = promisePool.format(
    `INSERT INTO OutDockets (departureAt, transportOptionId, userId, docketNumber)
    VALUES (?, ?, ?, ?)`,
    [
      outDocket.departureAt,
      outDocket.transportOptionId,
      outDocket.userId,
      outDocket.docketNumber
    ]
  );
  console.log(sql);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('OutDocket not created', 400);
  }
  return headers.insertId;
};

const putOutDocket = async (
  data: PutOutDocket,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format('UPDATE OutDockets SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('OutDocket not updated', 400);
  }

  return true;
};

const deleteOutDocket = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM OutDockets WHERE id = ?;', [id]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('OutDocket not deleted', 400);
  }

  return true;
};

export {
  getAllOutDockets,
  getOutDocket,
  postOutDocket,
  putOutDocket,
  deleteOutDocket
};
