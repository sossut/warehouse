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
      JSON_OBJECT(
        'id', OutDockets.id, 
        'departureAt', OutDockets.departureAt, 
        'transportOptionId', 
        OutDockets.transportOptionId, 
        'userId', OutDockets.userId) AS OutDocket,
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
          'id', products.id,
          'name', products.name,
          'code', products.code,
          'weight', products.weight,
          'quantity', OutDocketProducts.productQuantity,
          'quantityOptionId', products.quantityOptionId
        )), ']') AS products,
      JSON_OBJECT(
        'id', clients.id,
        'name', clients.name
      ) AS client
    FROM OutDockets
    JOIN OutDocketProducts ON OutDockets.id = OutDocketProducts.OutDocketId
    JOIN products ON OutDocketProducts.productId = products.id
    JOIN clients ON OutDockets.clientId = clients.id
    GROUP BY OutDockets.id`
  );
  if (rows.length === 0) {
    throw new CustomError('No OutDockets found', 404);
  }
  const OutDockets = rows.map((row) => ({
    ...row,
    OutDocket: JSON.parse(row.OutDocket.toString() || '{}'),
    products: JSON.parse(row.products?.toString() || '{}'),
    client: JSON.parse(row.client?.toString() || '{}')
  }));
  return OutDockets;
};

const getOutDocket = async (id: string): Promise<OutDocket> => {
  const [rows] = await promisePool.execute<GetOutDocket[]>(
    `SELECT 
      JSON_OBJECT(
        'id', OutDockets.id, 
        'departureAt', OutDockets.departureAt, 
        'transportOptionId', 
        OutDockets.transportOptionId, 
        'userId', OutDockets.userId) AS OutDocket,
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
          'id', products.id,
          'name', products.name,
          'code', products.code,
          'weight', products.weight,
          'quantity', OutDocketProducts.productQuantity,
          'quantityOptionId', products.quantityOptionId
        )), ']') AS products,
      JSON_OBJECT(
        'id', clients.id,
        'name', clients.name
      ) AS client
    FROM OutDockets
    JOIN OutDocketProducts ON OutDockets.id = OutDocketProducts.OutDocketId
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
    OutDocket: JSON.parse(row.OutDocket.toString() || '{}'),
    products: JSON.parse(row.products?.toString() || '{}'),
    client: JSON.parse(row.client?.toString() || '{}')
  }));
  return OutDockets[0];
};

const postOutDocket = async (outDocket: PostOutDocket) => {
  const sql = promisePool.format(
    `INSERT INTO OutDockets (departureAt, transportOptionId, userId)
    VALUES (?, ?, ?)`,
    [outDocket.departureAt, outDocket.transportOptionId, outDocket.userId]
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
