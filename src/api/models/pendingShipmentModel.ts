import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetPendingShipment,
  PostPendingShipment,
  PutPendingShipment,
  PendingShipment
} from '../../interfaces/PendingShipment';

const getAllPendingShipments = async (): Promise<PendingShipment[]> => {
  const [rows] = await promisePool.execute<GetPendingShipment[]>(
    `SELECT 
   PendingShipments.id, PendingShipments.departureAt, PendingShipments.transportOptionId, PendingShipments.userId,  PendingShipments.createdAt, PendingShipments.status, PendingShipments.parcels,
   CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
        'id', products.id,
        'name', products.name,
        'code', products.code,
        'weight', products.weight,
        'orderedProductId', PendingShipmentProducts.id,
        'orderedProductQuantity', PendingShipmentProducts.orderedProductQuantity,
        'collectedProductQuantity', PendingShipmentProducts.collectedProductQuantity,
        'quantityOption', JSON_OBJECT('id', products.quantityOptionId, 'quantityOption', quantityOptions.quantityOption)
      )), ']') AS products,
   JSON_OBJECT('id', transportOptions.id, 'transportOption', transportOptions.transportOption) AS transportOption,
   JSON_OBJECT(
     'outDocketId', OutDockets.id,
     'docketNumber', OutDockets.docketNumber,
     'createdAt', OutDockets.createdAt,
      'status', OutDockets.status
     
     ) AS outDocket,
      JSON_OBJECT(
      'id', clients.id,
      'name', clients.name
      ) AS client
     FROM PendingShipments
     LEFT JOIN TransportOptions ON PendingShipments.transportOptionId = TransportOptions.id
     LEFT JOIN PendingShipmentProducts ON PendingShipments.id = PendingShipmentProducts.PendingShipmentId
     LEFT JOIN products ON PendingShipmentProducts.productId = products.id
     LEFT JOIN quantityOptions ON products.quantityOptionId = quantityOptions.id
     LEFT JOIN OutDockets ON PendingShipments.docketId = OutDockets.id
     LEFT JOIN clients ON OutDockets.clientId = clients.id
     GROUP BY PendingShipments.id`
  );
  if (rows.length === 0) {
    throw new CustomError('No PendingShipments found', 404);
  }
  const pendingShipments = rows.map((row) => ({
    ...row,
    products: JSON.parse(row.products?.toString() || '{}'),
    transportOption: JSON.parse(row.transportOption?.toString() || '{}'),
    outDocket: JSON.parse(row.outDocket?.toString() || '{}'),
    client: JSON.parse(row.client?.toString() || '{}')
  }));
  return pendingShipments;
};

const getPendingShipment = async (id: string): Promise<PendingShipment> => {
  const [rows] = await promisePool.execute<GetPendingShipment[]>(
    `SELECT 
   PendingShipments.id, PendingShipments.departureAt, PendingShipments.transportOptionId, PendingShipments.userId,  PendingShipments.createdAt, PendingShipments.status, PendingShipments.parcels,
   CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
        'id', products.id,
        'name', products.name,
        'code', products.code,
        'weight', products.weight,
        'orderedProductId', PendingShipmentProducts.id,
        'orderedProductQuantity', PendingShipmentProducts.orderedProductQuantity,
        'collectedProductQuantity', PendingShipmentProducts.collectedProductQuantity,
        'quantityOption', JSON_OBJECT('id', products.quantityOptionId, 'quantityOption', quantityOptions.quantityOption)
      )), ']') AS products,
   JSON_OBJECT('id', transportOptions.id, 'transportOption', transportOptions.transportOption) AS transportOption,
   JSON_OBJECT(
     'outDocketId', OutDockets.id,
     'docketNumber', OutDockets.docketNumber,
     'createdAt', OutDockets.createdAt,
      'status', OutDockets.status
     
     ) AS outDocket,
      JSON_OBJECT(
      'id', clients.id,
      'name', clients.name
      ) AS client
     FROM PendingShipments
     LEFT JOIN TransportOptions ON PendingShipments.transportOptionId = TransportOptions.id
     LEFT JOIN PendingShipmentProducts ON PendingShipments.id = PendingShipmentProducts.PendingShipmentId
     LEFT JOIN products ON PendingShipmentProducts.productId = products.id
     LEFT JOIN quantityOptions ON products.quantityOptionId = quantityOptions.id
     LEFT JOIN OutDockets ON PendingShipments.docketId = OutDockets.id
     LEFT JOIN clients ON OutDockets.clientId = clients.id
     
    WHERE PendingShipments.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('PendingShipment not found', 404);
  }
  const pendingShipment = rows.map((row) => ({
    ...row,
    products: JSON.parse(row.products?.toString() || '{}'),
    transportOption: JSON.parse(row.transportOption?.toString() || '{}'),
    outDocket: JSON.parse(row.outDocket?.toString() || '{}'),
    client: JSON.parse(row.client?.toString() || '{}')
  }));
  return pendingShipment[0];
};

const postPendingShipment = async (pendingShipment: PostPendingShipment) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO PendingShipments (departureAt, docketId, transportOptionId, userId, parcels) 
    VALUES (?, ?, ?, ?, ?)`,
    [
      pendingShipment.departureAt,
      pendingShipment.docketId,
      pendingShipment.transportOptionId,
      pendingShipment.userId,
      pendingShipment.parcels
    ]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('PendingShipment not created', 400);
  }
  return headers.insertId;
};

const putPendingShipment = async (id: string, data: PutPendingShipment) => {
  const sql = promisePool.format(
    `UPDATE PendingShipments
    SET ?
    WHERE id = ?`,
    [data, id]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('PendingShipment not updated', 400);
  }
  return true;
};

const deletePendingShipment = async (id: string) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM PendingShipments
    WHERE id = ?`,
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('PendingShipment not deleted', 400);
  }
  return true;
};

export {
  getAllPendingShipments,
  getPendingShipment,
  postPendingShipment,
  putPendingShipment,
  deletePendingShipment
};
