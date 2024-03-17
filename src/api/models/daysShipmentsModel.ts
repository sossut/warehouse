import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  DaysShipments,
  GetDaysShipments,
  PostDaysShipments,
  PutDaysShipments
} from '../../interfaces/DaysShipments';

const getAllDaysShipments = async (): Promise<DaysShipments[]> => {
  const [rows] = await promisePool.execute<GetDaysShipments[]>(
    `SELECT 
      DaysShipments.id, 
      DaysShipments.departedAt,
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
        'id', daysShipmentsSentOutDockets.id,
        'daysShipmentsId', daysShipmentsSentOutDockets.daysShipmentsId,
        'sentOutDocketId', daysShipmentsSentOutDockets.sentOutDocketId,
        'sentOutDocket', (
          SELECT JSON_OBJECT(
            'id', SentOutDockets.id,
            'departureAt', SentOutDockets.departureAt,
            'transportOptionId', SentOutDockets.transportOptionId,
            'userId', SentOutDockets.userId,
            'createdAt', SentOutDockets.createdAt,
            'status', SentOutDockets.status,
            'parcels', SentOutDockets.parcels,
            'products', (
              SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
                'id', products.id,
                'name', products.name,
                'code', products.code,
                'weight', products.weight,
                'orderedProductQuantity', SentOutDocketProducts.orderedProductQuantity,
                'deliveredProductQuantity', SentOutDocketProducts.deliveredProductQuantity,
                'quantityOption', JSON_OBJECT('id', products.quantityOptionId, 'quantityOption', quantityOptions.quantityOption)
              )), ']')
              FROM SentOutDocketProducts
              LEFT JOIN products ON SentOutDocketProducts.productId = products.id
              LEFT JOIN quantityOptions ON products.quantityOptionId = quantityOptions.id
              WHERE SentOutDockets.id = SentOutDocketProducts.SentOutDocketId
            ),
            'transportOption', (
              SELECT JSON_OBJECT('id', transportOptions.id, 'transportOption', transportOptions.transportOption)
              FROM TransportOptions
              WHERE SentOutDockets.transportOptionId = TransportOptions.id
            ),
            'outDocket', (
              SELECT JSON_OBJECT(
                'outDocketId', OutDockets.id,
                'docketNumber', OutDockets.docketNumber,
                'createdAt', OutDockets.createdAt,
                'status', OutDockets.status
              )
              FROM OutDockets
              WHERE SentOutDockets.docketId = OutDockets.id
            ),
            'client', (
              SELECT JSON_OBJECT(
                'id', clients.id,
                'name', clients.name
              )
              FROM clients
              WHERE OutDockets.clientId = clients.id
            )
          )
          FROM SentOutDockets
          LEFT JOIN OutDockets ON SentOutDockets.docketId = OutDockets.id
          LEFT JOIN clients ON OutDockets.clientId = clients.id
          LEFT JOIN TransportOptions ON SentOutDockets.transportOptionId = TransportOptions.id
          
        
          WHERE daysShipmentsSentOutDockets.sentOutDocketId = SentOutDockets.id
        )
      )), ']') AS sentOutDockets
    FROM DaysShipments
    LEFT JOIN DaysShipmentsSentOutDockets ON DaysShipments.id = DaysShipmentsSentOutDockets.daysShipmentsId
    GROUP BY DaysShipments.id`
  );
  if (rows.length === 0) {
    throw new CustomError('No DaysShipments found', 404);
  }
  const daysShipments = rows.map((row) => {
    const sentOutDockets = JSON.parse(row.sentOutDockets.toString() || '[]');
    return {
      ...row,
      sentOutDockets: sentOutDockets.map(
        (docket: {
          sentOutDocket: {
            toString: () => any;
            products: { toString: () => any };
            transportOption: { toString: () => any };
            outDocket: { toString: () => any };
          };
        }) => {
          const sentOutDocket = JSON.parse(
            docket.sentOutDocket?.toString() || '{}'
          );
          return {
            ...docket,
            sentOutDocket: {
              ...sentOutDocket,
              products: JSON.parse(sentOutDocket.products?.toString() || '[]'),
              transportOption: JSON.parse(
                sentOutDocket.transportOption?.toString() || '{}'
              ),
              outDocket: JSON.parse(sentOutDocket.outDocket?.toString() || '{}')
            }
          };
        }
      )
    };
  });
  return daysShipments;
};

const getDaysShipments = async (id: string): Promise<DaysShipments> => {
  const [rows] = await promisePool.execute<GetDaysShipments[]>(
    `SELECT 
      DaysShipments.id, 
      DaysShipments.departedAt,
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
        'id', daysShipmentsSentOutDockets.id,
        'daysShipmentsId', daysShipmentsSentOutDockets.daysShipmentsId,
        'sentOutDocketId', daysShipmentsSentOutDockets.sentOutDocketId,
        'sentOutDocket', (
          SELECT JSON_OBJECT(
            'id', SentOutDockets.id,
            'departureAt', SentOutDockets.departureAt,
            'transportOptionId', SentOutDockets.transportOptionId,
            'userId', SentOutDockets.userId,
            'createdAt', SentOutDockets.createdAt,
            'status', SentOutDockets.status,
            'parcels', SentOutDockets.parcels,
            'products', (
              SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
                'id', products.id,
                'name', products.name,
                'code', products.code,
                'weight', products.weight,
                'orderedProductQuantity', SentOutDocketProducts.orderedProductQuantity,
                'deliveredProductQuantity', SentOutDocketProducts.deliveredProductQuantity,
                'quantityOption', JSON_OBJECT('id', products.quantityOptionId, 'quantityOption', quantityOptions.quantityOption)
              )), ']')
              FROM SentOutDocketProducts
              LEFT JOIN products ON SentOutDocketProducts.productId = products.id
              LEFT JOIN quantityOptions ON products.quantityOptionId = quantityOptions.id
              WHERE SentOutDockets.id = SentOutDocketProducts.SentOutDocketId
            ),
            'transportOption', (
              SELECT JSON_OBJECT('id', transportOptions.id, 'transportOption', transportOptions.transportOption)
              FROM TransportOptions
              WHERE SentOutDockets.transportOptionId = TransportOptions.id
            ),
            'outDocket', (
              SELECT JSON_OBJECT(
                'outDocketId', OutDockets.id,
                'docketNumber', OutDockets.docketNumber,
                'createdAt', OutDockets.createdAt,
                'status', OutDockets.status
              )
              FROM OutDockets
              WHERE SentOutDockets.docketId = OutDockets.id
            ),
            'client', (
              SELECT JSON_OBJECT(
                'id', clients.id,
                'name', clients.name
              )
              FROM clients
              WHERE OutDockets.clientId = clients.id
            )
          )
          FROM SentOutDockets
          LEFT JOIN OutDockets ON SentOutDockets.docketId = OutDockets.id
          LEFT JOIN clients ON OutDockets.clientId = clients.id
          LEFT JOIN TransportOptions ON SentOutDockets.transportOptionId = TransportOptions.id
          
        
          WHERE daysShipmentsSentOutDockets.sentOutDocketId = SentOutDockets.id
        )
      )), ']') AS sentOutDockets
    FROM DaysShipments
    LEFT JOIN DaysShipmentsSentOutDockets ON DaysShipments.id = DaysShipmentsSentOutDockets.daysShipmentsId
  WHERE DaysShipments.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('DaysShipments not found', 404);
  }
  const daysShipments = rows.map((row) => {
    const sentOutDockets = JSON.parse(row.sentOutDockets.toString() || '[]');
    return {
      ...row,
      sentOutDockets: sentOutDockets.map(
        (docket: {
          sentOutDocket: {
            toString: () => any;
            products: { toString: () => any };
            transportOption: { toString: () => any };
            outDocket: { toString: () => any };
          };
        }) => {
          const sentOutDocket = JSON.parse(
            docket.sentOutDocket?.toString() || '{}'
          );
          return {
            ...docket,
            sentOutDocket: {
              ...sentOutDocket,
              products: JSON.parse(sentOutDocket.products?.toString() || '[]'),
              transportOption: JSON.parse(
                sentOutDocket.transportOption?.toString() || '{}'
              ),
              outDocket: JSON.parse(sentOutDocket.outDocket?.toString() || '{}')
            }
          };
        }
      )
    };
  });
  return daysShipments[0];
};

const postDaysShipments = async (daysShipments: PostDaysShipments) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO DaysShipments (departedAt)
    VALUES (?)`,
    [daysShipments.departedAt]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('DaysShipments not created', 400);
  }
  return headers.insertId;
};

const putDaysShipments = async (
  data: PutDaysShipments,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format('UPDATE DaysShipments SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('DaysShipments not updated', 400);
  }

  return true;
};

const deleteDaysShipments = async (id: number): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM DaysShipments
    WHERE id = ?`,
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('DaysShipments not deleted', 400);
  }

  return true;
};

export {
  getAllDaysShipments,
  getDaysShipments,
  postDaysShipments,
  putDaysShipments,
  deleteDaysShipments
};
