import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  DaysShipmentsSentOutDocket,
  GetDaysShipmentsSentOutDocket,
  PostDaysShipmentsSentOutDocket,
  PutDaysShipmentsSentOutDocket
} from '../../interfaces/DaysShipmentsSentOutDocket';

const getAllDaysShipmentsSentOutDockets = async (): Promise<
  DaysShipmentsSentOutDocket[]
> => {
  const [rows] = await promisePool.execute<GetDaysShipmentsSentOutDocket[]>(
    `SELECT *
    FROM daysShipmentsSentOutDockets`
  );
  if (rows.length === 0) {
    throw new CustomError('No daysShipmentsSentOutDockets found', 404);
  }
  return rows;
};

const getDaysShipmentsSentOutDocket = async (
  id: string
): Promise<DaysShipmentsSentOutDocket> => {
  const [rows] = await promisePool.execute<GetDaysShipmentsSentOutDocket[]>(
    `SELECT *
    FROM daysShipmentsSentOutDockets
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('DaysShipmentsSentOutDocket not found', 404);
  }
  return rows[0];
};

const postDaysShipmentsSentOutDocket = async (
  daysShipmentsSentOutDocket: PostDaysShipmentsSentOutDocket
) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO daysShipmentsSentOutDockets (daysShipmentsId, sentOutDocketId)
    VALUES (?, ?)`,
    [
      daysShipmentsSentOutDocket.daysShipmentsId,
      daysShipmentsSentOutDocket.sentOutDocketId
    ]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('DaysShipmentsSentOutDocket not created', 400);
  }
  return headers.insertId;
};

const putDaysShipmentsSentOutDocket = async (
  data: PutDaysShipmentsSentOutDocket,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format(
    'UPDATE daysShipmentsSentOutDockets SET ? WHERE id = ?;',
    [data, id]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('DaysShipmentsSentOutDocket not updated', 400);
  }

  return true;
};

const deleteDaysShipmentsSentOutDocket = async (
  id: number
): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM daysShipmentsSentOutDockets
    WHERE id = ?`,
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('DaysShipmentsSentOutDocket not deleted', 400);
  }

  return true;
};

export {
  getAllDaysShipmentsSentOutDockets,
  getDaysShipmentsSentOutDocket,
  postDaysShipmentsSentOutDocket,
  putDaysShipmentsSentOutDocket,
  deleteDaysShipmentsSentOutDocket
};
