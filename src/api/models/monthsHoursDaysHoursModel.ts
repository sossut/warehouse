import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  MonthsHoursDaysHours,
  GetMonthsHoursDaysHours,
  PostMonthsHoursDaysHours,
  PutMonthsHoursDaysHours
} from '../../interfaces/MonthsHoursDaysHours';

const getAllMonthsHoursDaysHours = async (): Promise<
  MonthsHoursDaysHours[]
> => {
  const [rows] = await promisePool.execute<GetMonthsHoursDaysHours[]>(
    `SELECT 
      *
    FROM MonthsHoursDaysHours`
  );
  if (rows.length === 0) {
    throw new CustomError('No MonthsHoursDaysHours found', 404);
  }
  return rows;
};

const getMonthsHoursDaysHours = async (
  id: string
): Promise<MonthsHoursDaysHours> => {
  const [rows] = await promisePool.execute<GetMonthsHoursDaysHours[]>(
    `SELECT 
      *
    FROM MonthsHoursDaysHours
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('MonthsHoursDaysHours not found', 404);
  }
  return rows[0];
};

const postMonthsHoursDaysHours = async (
  monthsHoursDaysHours: PostMonthsHoursDaysHours
) => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO MonthsHoursDaysHours (daysHoursId, monthsHoursId)
    VALUES (?, ?)`,
    [monthsHoursDaysHours.daysHoursId, monthsHoursDaysHours.monthsHoursId]
  );
  if (result.affectedRows === 0) {
    throw new CustomError('MonthsHoursDaysHours not created', 400);
  }
  return result.insertId;
};

const putMonthsHoursDaysHours = async (
  id: string,
  monthsHoursDaysHours: PutMonthsHoursDaysHours
): Promise<ResultSetHeader> => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    `UPDATE MonthsHoursDaysHours
    SET ?
    WHERE id = ?`,
    [monthsHoursDaysHours, id]
  );
  return result;
};

export {
  getAllMonthsHoursDaysHours,
  getMonthsHoursDaysHours,
  postMonthsHoursDaysHours,
  putMonthsHoursDaysHours
};
