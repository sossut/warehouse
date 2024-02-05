import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  FloorSpot,
  GetFloorSpot,
  PutFloorSpot
} from '../../interfaces/FloorSpot';

const getAllFloorSpots = async (): Promise<FloorSpot[]> => {
  const [rows] = await promisePool.execute<GetFloorSpot[]>(
    `SELECT *
    FROM floorSpots`
  );
  if (rows.length === 0) {
    throw new CustomError('No floorSpots found', 404);
  }
  return rows;
};

const getFloorSpot = async (id: string): Promise<FloorSpot> => {
  const [rows] = await promisePool.execute<GetFloorSpot[]>(
    `SELECT *
    FROM floorSpots
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('FloorSpot not found', 404);
  }
  return rows[0];
};

const postFloorSpot = async () => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO floorSpots ()
    VALUES ()`
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('FloorSpot not created', 400);
  }
  return headers.insertId;
};

const putFloorSpot = async (
  data: PutFloorSpot,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format('UPDATE floorSpots SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('FloorSpot not updated', 400);
  }

  return true;
};

const deleteFloorSpot = async (id: number): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM floorSpots
    WHERE id = ?`,
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('FloorSpot not found', 404);
  }
  return true;
};

export {
  getAllFloorSpots,
  getFloorSpot,
  postFloorSpot,
  putFloorSpot,
  deleteFloorSpot
};
