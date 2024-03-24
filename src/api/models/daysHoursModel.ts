import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  DaysHours,
  GetDaysHours,
  PostDaysHours,
  PutDaysHours
} from '../../interfaces/DaysHours';

const getAllDaysHours = async (): Promise<DaysHours[]> => {
  const [rows] = await promisePool.execute<GetDaysHours[]>(
    `SELECT * 
    FROM DaysHours`
  );
  if (rows.length === 0) {
    throw new CustomError('No DaysHours found', 404);
  }
  return rows;
};

const getDaysHours = async (id: string): Promise<DaysHours> => {
  const [rows] = await promisePool.execute<GetDaysHours[]>(
    `SELECT * 
    FROM DaysHours
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('DaysHours not found', 404);
  }
  return rows[0];
};

const postDaysHours = async (daysHours: PostDaysHours) => {
  const sql = promisePool.format(
    `INSERT INTO DaysHours (day, workedHoursSeconds, kilometers)
    VALUES (?, ?, ?)`,
    [daysHours.day, daysHours.workedHoursSeconds, daysHours.kilometers]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('DaysHours not created', 400);
  }
  return headers.insertId;
};

const putDaysHours = async (id: string, data: PutDaysHours) => {
  const sql = promisePool.format(
    `UPDATE DaysHours
    SET ?
    WHERE id = ?`,
    [data, id]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('DaysHours not updated', 400);
  }
  return true;
};

const deleteDaysHours = async (id: string) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM DaysHours
    WHERE id = ?`,
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('DaysHours not deleted', 400);
  }
  return true;
};

export {
  getAllDaysHours,
  getDaysHours,
  postDaysHours,
  putDaysHours,
  deleteDaysHours
};
