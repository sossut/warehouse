import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  MonthsHours,
  GetMonthsHours,
  PostMonthsHours,
  PutMonthsHours
} from '../../interfaces/MonthsHours';

const getAllMonthsHours = async (): Promise<MonthsHours[]> => {
  const [rows] = await promisePool.execute<GetMonthsHours[]>(
    `SELECT 
      MonthsHours.id, MonthsHours.startDate, MonthsHours.endDate,
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
        'id', DaysHours.id,
        'day', DaysHours.day,
        'hoursSeconds', DaysHours.workedHoursSeconds,
        'kilometers', DaysHours.kilometers
      )), ']') AS daysHours,
      SUM(DaysHours.workedHoursSeconds) AS monthsWorkedHoursSeconds,
      SUM(DaysHours.kilometers) AS monthsKilometers
    FROM MonthsHours
    LEFT JOIN MonthsHoursDaysHours ON MonthsHours.id = MonthsHoursDaysHours.monthsHoursId
    LEFT JOIN DaysHours ON MonthsHoursDaysHours.daysHoursId = DaysHours.id
    GROUP BY MonthsHours.id`
  );
  if (rows.length === 0) {
    throw new CustomError('No MonthsHours found', 404);
  }
  const monthsHours = rows.map((row) => ({
    ...row,
    daysHours: JSON.parse(row.daysHours?.toString() || '[]')
  }));

  return monthsHours;
};

const getMonthsHours = async (id: string): Promise<MonthsHours> => {
  const [rows] = await promisePool.execute<GetMonthsHours[]>(
    `SELECT 
      MonthsHours.id, MonthsHours.startDate, MonthsHours.endDate,
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
        'id', DaysHours.id,
        'day', DaysHours.day,
        'hoursSeconds', DaysHours.workedHoursSeconds,
        'kilometers', DaysHours.kilometers
      )), ']') AS daysHours,
      SUM(DaysHours.workedHoursSeconds) AS monthsWorkedHoursSeconds,
      SUM(DaysHours.kilometers) AS monthsKilometers
    FROM MonthsHours
    LEFT JOIN MonthsHoursDaysHours ON MonthsHours.id = MonthsHoursDaysHours.monthsHoursId
    LEFT JOIN DaysHours ON MonthsHoursDaysHours.daysHoursId = DaysHours.id
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('MonthsHours not found', 404);
  }
  const monthsHours = rows.map((row) => ({
    ...row,
    daysHours: JSON.parse(row.daysHours?.toString() || '[]')
  }));
  return monthsHours[0];
};

const postMonthsHours = async (monthsHours: PostMonthsHours) => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO MonthsHours (startDate, endDate)
    VALUES (?, ?)`,
    [monthsHours.startDate, monthsHours.endDate]
  );
  if (result.affectedRows === 0) {
    throw new CustomError('MonthsHours not created', 400);
  }
  return result.insertId;
};

const putMonthsHours = async (
  id: string,
  monthsHours: PutMonthsHours
): Promise<ResultSetHeader> => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    `UPDATE MonthsHours
    SET ?
    WHERE id = ?`,
    [monthsHours, id]
  );
  return result;
};

const deleteMonthsHours = async (id: string): Promise<ResultSetHeader> => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM MonthsHours
    WHERE id = ?`,
    [id]
  );
  return result;
};

export {
  getAllMonthsHours,
  getMonthsHours,
  postMonthsHours,
  putMonthsHours,
  deleteMonthsHours
};
