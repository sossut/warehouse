import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetReceivedInDocket,
  PostReceivedInDocket,
  PutReceivedInDocket,
  ReceivedInDocket
} from '../../interfaces/ReceivedInDocket';

const getAllReceivedInDockets = async (): Promise<ReceivedInDocket[]> => {
  const [rows] = await promisePool.execute<GetReceivedInDocket[]>(
    `SELECT 
      ReceivedInDockets.id, ReceivedInDockets.inDocketId, ReceivedInDockets.arrivedAt, ReceivedInDockets.userId, ReceivedInDockets.createdAt, ReceivedInDockets.status,
      JSON_OBJECT('id', vendors.id, 'name', vendors.name) AS vendor,
      JSON_OBJECT('id', users.id, 'name', users.name) AS user,
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
        'id', ReceivedInDocketProducts.id,
        'productId', ReceivedInDocketProducts.productId,
        'orderedProductQuantity', ReceivedInDocketProducts.orderedProductQuantity,
        'receivedProductQuantity', ReceivedInDocketProducts.receivedProductQuantity
      )), ']') AS products
      FROM ReceivedInDockets
      LEFT JOIN vendors ON ReceivedInDockets.vendorId = vendors.id
      LEFT JOIN users ON ReceivedInDockets.userId = users.id
      LEFT JOIN ReceivedInDocketProducts ON ReceivedInDockets.id = ReceivedInDocketProducts.receivedInDocketId
      GROUP BY ReceivedInDockets.id`
  );
  if (rows.length === 0) {
    throw new CustomError('No ReceivedInDockets found', 404);
  }
  const receivedInDockets = rows.map((row) => ({
    ...row,
    vendor: JSON.parse(row.vendor?.toString() || '{}'),
    user: JSON.parse(row.user?.toString() || '{}'),
    products: JSON.parse(row.products?.toString() || '[]')
  }));
  return receivedInDockets;
};

const getReceivedInDocket = async (id: string): Promise<ReceivedInDocket> => {
  const [rows] = await promisePool.execute<GetReceivedInDocket[]>(
    `SELECT 
      ReceivedInDockets.id, ReceivedInDockets.inDocketId, ReceivedInDockets.arrivedAt, ReceivedInDockets.userId, ReceivedInDockets.createdAt, ReceivedInDockets.status,
      JSON_OBJECT('id', vendors.id, 'name', vendors.name) AS vendor,
      JSON_OBJECT('id', users.id, 'name', users.name) AS user,
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
        'id', ReceivedInDocketProducts.id,
        'productId', ReceivedInDocketProducts.productId,
        'orderedProductQuantity', ReceivedInDocketProducts.orderedProductQuantity,
        'receivedProductQuantity', ReceivedInDocketProducts.receivedProductQuantity
      )), ']') AS products
      FROM ReceivedInDockets
      LEFT JOIN vendors ON ReceivedInDockets.vendorId = vendors.id
      LEFT JOIN users ON ReceivedInDockets.userId = users.id
      LEFT JOIN ReceivedInDocketProducts ON ReceivedInDockets.id = ReceivedInDocketProducts.receivedInDocketId
      WHERE ReceivedInDockets.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('ReceivedInDocket not found', 404);
  }
  const receivedInDocket = rows.map((row) => ({
    ...row,
    vendor: JSON.parse(row.vendor?.toString() || '{}'),
    user: JSON.parse(row.user?.toString() || '{}'),
    products: JSON.parse(row.products?.toString() || '[]')
  }))[0];
  return receivedInDocket;
};

const postReceivedInDocket = async (receivedInDocket: PostReceivedInDocket) => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO ReceivedInDockets (inDocketId, vendorId, arrivedAt, userId)
    VALUES (?, ?, ?, ?)`,
    [
      receivedInDocket.inDocketId,
      receivedInDocket.vendorId,
      receivedInDocket.arrivedAt,
      receivedInDocket.userId
    ]
  );
  return result.insertId;
};

const putReceivedInDocket = async (
  id: string,
  receivedInDocket: PutReceivedInDocket
): Promise<boolean> => {
  const sql = promisePool.format(
    'UPDATE ReceivedInDockets SET ? WHERE id = ?;',
    [receivedInDocket, id]
  );
  const [result] = await promisePool.query<ResultSetHeader>(sql);
  if (result.affectedRows === 0) {
    throw new CustomError('ReceivedInDocket not found', 404);
  }
  return true;
};

const deleteReceivedInDocket = async (id: string): Promise<boolean> => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM ReceivedInDockets WHERE id = ?',
    [id]
  );
  if (result.affectedRows === 0) {
    throw new CustomError('ReceivedInDocket not found', 404);
  }
  return true;
};

export {
  getAllReceivedInDockets,
  getReceivedInDocket,
  postReceivedInDocket,
  putReceivedInDocket,
  deleteReceivedInDocket
};
