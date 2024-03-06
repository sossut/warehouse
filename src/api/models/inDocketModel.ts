import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';

import {
  InDocket,
  GetInDocket,
  PostInDocket,
  PutInDocket
} from '../../interfaces/InDocket';
import { ResultSetHeader } from 'mysql2';

const getAllInDockets = async (): Promise<InDocket[]> => {
  const [rows] = await promisePool.execute<GetInDocket[]>(
    `SELECT InDockets.id, InDockets.docketNumber, InDockets.arrivalAt, InDockets.userId, InDockets.filename, vendorId, status, InDockets.createdAt, InDockets.updatedAt,
    CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
      'id', products.id,
      'name', products.name,
      'code', products.code,
      'weight', products.weight,
      'inDocketProductId', InDocketProducts.id,
      'orderedProductQuantity', InDocketProducts.orderedProductQuantity,
      'receivedProductQuantity', InDocketProducts.receivedProductQuantity,
      'quantityOption', JSON_OBJECT('id', products.quantityOptionId, 'quantityOption', quantityOptions.quantityOption)
    )), ']') AS products,
    JSON_OBJECT(
      'id', vendors.id,
      'name', vendors.name
    ) AS vendor
    FROM InDockets
    LEFT JOIN InDocketProducts ON InDockets.id = InDocketProducts.inDocketId
    LEFT JOIN products ON InDocketProducts.productId = products.id
    LEFT JOIN quantityOptions ON products.quantityOptionId = quantityOptions.id
    LEFT JOIN vendors ON InDockets.vendorId = vendors.id
    GROUP BY InDockets.id`
  );
  if (rows.length === 0) {
    throw new CustomError('No inDockets found', 404);
  }
  return rows;
};

const getInDocket = async (id: string): Promise<InDocket> => {
  const [rows] = await promisePool.execute<GetInDocket[]>(
    `SELECT InDockets.id, InDockets.docketNumber, InDockets.arrivalAt, InDockets.userId, InDockets.filename, vendorId, status, InDockets.createdAt, InDockets.updatedAt,
    CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
      'id', products.id,
      'name', products.name,
      'code', products.code,
      'weight', products.weight,
      'inDocketProductId', InDocketProducts.id,
      'orderedProductQuantity', InDocketProducts.orderedProductQuantity,
      'receivedProductQuantity', InDocketProducts.receivedProductQuantity,
      'quantityOption', JSON_OBJECT('id', products.quantityOptionId, 'quantityOption', quantityOptions.quantityOption)
    )), ']') AS products,
    JSON_OBJECT(
      'id', vendors.id,
      'name', vendors.name
    ) AS vendor
    FROM InDockets
    LEFT JOIN InDocketProducts ON InDockets.id = InDocketProducts.inDocketId
    LEFT JOIN products ON InDocketProducts.productId = products.id
    LEFT JOIN quantityOptions ON products.quantityOptionId = quantityOptions.id
    LEFT JOIN vendors ON InDockets.vendorId = vendors.id
    WHERE inDockets.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('InDocket not found', 404);
  }
  return rows[0];
};

const postInDocket = async (inDocket: PostInDocket) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO inDockets (docketNumber, arrivalAt, transportOptionId, userId)
    VALUES (?, ?, ?, ?)`,
    [
      inDocket.docketNumber,
      inDocket.arrivedAt,
      inDocket.userId,
      inDocket.vendorId
    ]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('InDocket not created', 400);
  }
  return headers.insertId;
};

const putInDocket = async (data: PutInDocket, id: number): Promise<boolean> => {
  const sql = promisePool.format('UPDATE inDockets SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('InDocket not updated', 400);
  }

  return true;
};

const deleteInDocket = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM inDockets WHERE id = ?;', [id]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('InDocket not deleted', 400);
  }

  return true;
};

export {
  getAllInDockets,
  getInDocket,
  postInDocket,
  putInDocket,
  deleteInDocket
};
