import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import { Spot, GetSpot, PostSpot, PutSpot } from '../../interfaces/Spot';

const getAllSpots = async (): Promise<Spot[]> => {
  const [rows] = await promisePool.execute<GetSpot[]>(
    `SELECT spots.id, spotNumber, gapId, palletId, shelf, disabled,
    JSON_OBJECT('id', gaps.id, 'rowNumber', gaps.gapNumber, 'spots', gaps.spots) AS gap,
    JSON_OBJECT('id', whRows.id, 'rowNumber', whrows.rowNumber, 'gaps', rows.gaps) AS row
    FROM spots`
  );
  if (rows.length === 0) {
    throw new CustomError('No spots found', 404);
  }
  const spots: Spot[] = rows.map((row) => ({
    ...row,
    gap: JSON.parse(row.gap.toString() || '{}'),
    row: JSON.parse(row.row.toString() || '{}')
  }));
  return spots;
};

const getSpot = async (id: string): Promise<Spot> => {
  const [rows] = await promisePool.execute<GetSpot[]>(
    `SELECT spots.id, spotNumber, gapId, palletId, shelf, disabled,
    JSON_OBJECT('id', gaps.id, 'rowNumber', gaps.gapNumber, 'spots', gaps.spots) AS gap,
    JSON_OBJECT('id', whRows.id, 'rowNumber', whrows.rowNumber, 'gaps', rows.gaps) AS row
    FROM spots
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('Spot not found', 404);
  }
  const spots: Spot[] = rows.map((row) => ({
    ...row,
    gap: JSON.parse(row.gap.toString() || '{}'),
    row: JSON.parse(row.row.toString() || '{}')
  }));
  return spots[0];
};

const postSpot = async (spot: PostSpot) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO spots (spotNumber, gapId)
    VALUES (?, ?)`,
    [spot.spotNumber, spot.gapId]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Spot not created', 400);
  }
  return headers.insertId;
};

const putSpot = async (data: PutSpot, id: number): Promise<boolean> => {
  const sql = promisePool.format('UPDATE spots SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Spot not updated', 400);
  }

  return true;
};

const deleteSpot = async (id: number): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM spots
    WHERE id = ?`,
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Spot not deleted', 400);
  }

  return true;
};

export { getAllSpots, getSpot, postSpot, putSpot, deleteSpot };
