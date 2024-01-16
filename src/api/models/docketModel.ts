import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  Docket,
  GetDocket,
  PostDocket,
  PutDocket
} from '../../interfaces/Docket';

const getAllDockets = async (): Promise<Docket[]> => {
  const [rows] = await promisePool.execute<GetDocket[]>(
    `SELECT 
      JSON_OBJECT(
        'id', dockets.id, 
        'departureAt', dockets.departureAt, 
        'transportOptionId', 
        dockets.transportOptionId, 
        'userId', dockets.userId) AS docket,
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
          'id', products.id,
          'name', products.name,
          'code', products.code,
          'weight', products.weight,
          'quantity', docketProducts.productQuantity,
          'quantityOptionId', products.quantityOptionId
        )), ']') AS products,
      JSON_OBJECT(
        'id', clients.id,
        'name', clients.name
      ) AS client
    FROM dockets
    JOIN docketProducts ON dockets.id = docketProducts.docketId
    JOIN products ON docketProducts.productId = products.id
    JOIN clients ON dockets.clientId = clients.id
    GROUP BY dockets.id`
  );
  if (rows.length === 0) {
    throw new CustomError('No dockets found', 404);
  }
  const dockets = rows.map((row) => ({
    ...row,
    docket: JSON.parse(row.docket.toString() || '{}'),
    products: JSON.parse(row.products?.toString() || '{}'),
    client: JSON.parse(row.client?.toString() || '{}')
  }));
  return dockets;
};

const getDocket = async (id: string): Promise<Docket> => {
  const [rows] = await promisePool.execute<GetDocket[]>(
    `SELECT 
      JSON_OBJECT(
        'id', dockets.id, 
        'departureAt', dockets.departureAt, 
        'transportOptionId', 
        dockets.transportOptionId, 
        'userId', dockets.userId) AS docket,
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
          'id', products.id,
          'name', products.name,
          'code', products.code,
          'weight', products.weight,
          'quantity', docketProducts.productQuantity,
          'quantityOptionId', products.quantityOptionId
        )), ']') AS products,
      JSON_OBJECT(
        'id', clients.id,
        'name', clients.name
      ) AS client
    FROM dockets
    JOIN docketProducts ON dockets.id = docketProducts.docketId
    JOIN products ON docketProducts.productId = products.id
    JOIN clients ON dockets.clientId = clients.id
    WHERE dockets.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('Docket not found', 404);
  }
  const dockets = rows.map((row) => ({
    ...row,
    docket: JSON.parse(row.docket.toString() || '{}'),
    products: JSON.parse(row.products?.toString() || '{}'),
    client: JSON.parse(row.client?.toString() || '{}')
  }));
  return dockets[0];
};

const postDocket = async (docket: PostDocket) => {
  const sql = promisePool.format(
    `INSERT INTO dockets (departureAt, transportOptionId, userId)
    VALUES (?, ?, ?)`,
    [docket.departureAt, docket.transportOptionId, docket.userId]
  );
  console.log(sql);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Docket not created', 400);
  }
  return headers.insertId;
};

const putDocket = async (data: PutDocket, id: number): Promise<boolean> => {
  const sql = promisePool.format('UPDATE dockets SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Docket not updated', 400);
  }

  return true;
};

const deleteDocket = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM dockets WHERE id = ?;', [id]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Docket not deleted', 400);
  }

  return true;
};

export { getAllDockets, getDocket, postDocket, putDocket, deleteDocket };
