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
   OutDockets.id, OutDockets.departureAt, OutDockets.transportOptionId, OutDockets.userId, OutDockets.docketNumber, OutDockets.createdAt, OutDockets.status, OutDockets.filename,
   JSON_OBJECT('id', transportOptions.id, 'transportOption', transportOptions.transportOption) AS transportOption,
   CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
      'id', products.id,
      'name', products.name,
      'code', products.code,
      'weight', products.weight,
      'outDocketProductId', OutDocketProducts.id,
      'orderedProductQuantity', OutDocketProducts.orderedProductQuantity,
      'deliveredProductQuantity', OutDocketProducts.deliveredProductQuantity,
      'collectedProductQuantity', ps.collectedProductQuantity,
      'pendingShipmentProductId', ps.id,
      'quantityOption', JSON_OBJECT('id', products.quantityOptionId, 'quantityOption', quantityOptions.quantityOption)
    )), ']') AS products,
   JSON_OBJECT(
    'id', clients.id,
    'name', clients.name
  ) AS client
FROM OutDockets
LEFT JOIN TransportOptions ON OutDockets.transportOptionId = TransportOptions.id
LEFT JOIN OutDocketProducts ON OutDockets.id = OutDocketProducts.OutDocketId
LEFT JOIN products ON OutDocketProducts.productId = products.id
LEFT JOIN quantityOptions ON products.quantityOptionId = quantityOptions.id
LEFT JOIN clients ON OutDockets.clientId = clients.id
LEFT JOIN (
   SELECT PendingShipments.docketId, PendingShipmentProducts.id, PendingShipmentProducts.productId, SUM(PendingShipmentProducts.collectedProductQuantity) as collectedProductQuantity
   FROM PendingShipments
   LEFT JOIN PendingShipmentProducts ON PendingShipments.id = PendingShipmentProducts.pendingShipmentId
   GROUP BY PendingShipments.docketId, PendingShipmentProducts.productId
) AS ps ON OutDockets.id = ps.docketId AND OutDocketProducts.productId = ps.productId
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
   OutDockets.id, OutDockets.departureAt, OutDockets.transportOptionId, OutDockets.userId, OutDockets.docketNumber, OutDockets.createdAt, OutDockets.status, OutDockets.filename,
   JSON_OBJECT('id', transportOptions.id, 'transportOption', transportOptions.transportOption) AS transportOption,
   CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
      'id', products.id,
      'name', products.name,
      'code', products.code,
      'weight', products.weight,
      'outDocketProductId', OutDocketProducts.id,
      'orderedProductQuantity', OutDocketProducts.orderedProductQuantity,
      'deliveredProductQuantity', OutDocketProducts.deliveredProductQuantity,
      'collectedProductQuantity', ps.collectedProductQuantity,
      'pendingShipmentProductId', ps.id,
      'quantityOption', JSON_OBJECT('id', products.quantityOptionId, 'quantityOption', quantityOptions.quantityOption)
    )), ']') AS products,
   JSON_OBJECT(
    'id', clients.id,
    'name', clients.name
  ) AS client
FROM OutDockets
LEFT JOIN TransportOptions ON OutDockets.transportOptionId = TransportOptions.id
LEFT JOIN OutDocketProducts ON OutDockets.id = OutDocketProducts.OutDocketId
LEFT JOIN products ON OutDocketProducts.productId = products.id
LEFT JOIN quantityOptions ON products.quantityOptionId = quantityOptions.id
LEFT JOIN clients ON OutDockets.clientId = clients.id
LEFT JOIN (
   SELECT PendingShipments.docketId, PendingShipmentProducts.id, PendingShipmentProducts.productId, SUM(PendingShipmentProducts.collectedProductQuantity) as collectedProductQuantity
   FROM PendingShipments
   LEFT JOIN PendingShipmentProducts ON PendingShipments.id = PendingShipmentProducts.pendingShipmentId
   GROUP BY PendingShipments.docketId, PendingShipmentProducts.productId
) AS ps ON OutDockets.id = ps.docketId AND OutDocketProducts.productId = ps.productId
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

const getOutDocketsByIds = async (ids: string[]): Promise<OutDocket[]> => {
  const sql = promisePool.format(
    `SELECT 
   OutDockets.id, OutDockets.departureAt, OutDockets.transportOptionId, OutDockets.userId, OutDockets.docketNumber, OutDockets.createdAt, OutDockets.status, OutDockets.filename,
   JSON_OBJECT('id', transportOptions.id, 'transportOption', transportOptions.transportOption) AS transportOption,
   CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
      'id', products.id,
      'name', products.name,
      'code', products.code,
      'weight', products.weight,
      'outDocketProductId', OutDocketProducts.id,
      'orderedProductQuantity', OutDocketProducts.orderedProductQuantity,
      'deliveredProductQuantity', OutDocketProducts.deliveredProductQuantity,
      'collectedProductQuantity', ps.collectedProductQuantity,
      'pendingShipmentProductId', ps.id,
      'quantityOption', JSON_OBJECT('id', products.quantityOptionId, 'quantityOption', quantityOptions.quantityOption)
    )), ']') AS products,
   JSON_OBJECT(
    'id', clients.id,
    'name', clients.name
  ) AS client
FROM OutDockets
LEFT JOIN TransportOptions ON OutDockets.transportOptionId = TransportOptions.id
LEFT JOIN OutDocketProducts ON OutDockets.id = OutDocketProducts.OutDocketId
LEFT JOIN products ON OutDocketProducts.productId = products.id
LEFT JOIN quantityOptions ON products.quantityOptionId = quantityOptions.id
LEFT JOIN clients ON OutDockets.clientId = clients.id
LEFT JOIN (
   SELECT PendingShipments.docketId, PendingShipmentProducts.id, PendingShipmentProducts.productId, SUM(PendingShipmentProducts.collectedProductQuantity) as collectedProductQuantity
   FROM PendingShipments
   LEFT JOIN PendingShipmentProducts ON PendingShipments.id = PendingShipmentProducts.pendingShipmentId
   GROUP BY PendingShipments.docketId, PendingShipmentProducts.productId
) AS ps ON OutDockets.id = ps.docketId AND OutDocketProducts.productId = ps.productId
    WHERE OutDockets.id IN (?)
    GROUP BY OutDockets.id`,
    [ids]
  );

  const [rows] = await promisePool.execute<GetOutDocket[]>(sql);
  if (rows.length === 0) {
    throw new CustomError('OutDocket not found', 404);
  }
  const OutDockets = rows.map((row) => ({
    ...row,
    products: JSON.parse(row.products?.toString() || '{}'),
    client: JSON.parse(row.client?.toString() || '{}'),
    transportOption: JSON.parse(row.transportOption?.toString() || '{}')
  }));

  return OutDockets;
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
): Promise<OutDocket> => {
  const sql = promisePool.format('UPDATE OutDockets SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('OutDocket not updated', 400);
  }

  const outDocket = await getOutDocket(id.toString());
  return outDocket;
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
  getOutDocketsByIds,
  postOutDocket,
  putOutDocket,
  deleteOutDocket
};
