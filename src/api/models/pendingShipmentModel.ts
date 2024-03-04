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
    `SELECT PendingShipments.id, PendingShipments.sentOutDocketId, PendingShipments.createdAt, OutDockets.id AS outDocketId, OutDockets.docketNumber
    FROM PendingShipments
    JOIN SentOutDockets ON PendingShipments.sentOutDocketId = SentOutDockets.id
    JOIN OutDockets ON SentOutDockets.docketId = OutDockets.id`
  );
  if (rows.length === 0) {
    throw new CustomError('No PendingShipments found', 404);
  }
  return rows;
};

const getPendingShipment = async (id: string): Promise<PendingShipment> => {
  const [rows] = await promisePool.execute<GetPendingShipment[]>(
    `SELECT PendingShipments.id, PendingShipments.sentOutDocketId, PendingShipments.createdAt, OutDockets.id AS outDocketId, OutDockets.docketNumber
    FROM PendingShipments
    JOIN SentOutDockets ON PendingShipments.sentOutDocketId = SentOutDockets.id
    JOIN OutDockets ON SentOutDockets.docketId = OutDockets.id
    WHERE PendingShipments.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('PendingShipment not found', 404);
  }
  return rows[0];
};

const postPendingShipment = async (pendingShipment: PostPendingShipment) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO PendingShipments (sentOutDocketId)
    VALUES (?)`,
    [pendingShipment.sentOutDocketId]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('PendingShipment not created', 400);
  }
  return headers.insertId;
};

const putPendingShipment = async (
  id: string,
  pendingShipment: PutPendingShipment
) => {
  const sql = promisePool.format(
    `UPDATE PendingShipments
    SET sentOutDocketId = ?
    WHERE id = ?`,
    [pendingShipment.sentOutDocketId, id]
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
