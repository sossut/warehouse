import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import { Gap, GetGap, PostGap, PutGap } from '../../interfaces/Gap';

const getAllGaps = async (): Promise<Gap[]> => {
  const [rows] = await promisePool.execute<GetGap[]>(
    `SELECT gaps.id, gapNumber, rowId,
    JSON_OBJECT('id', whRows.id, 'rowNumber', whrows.rowNumber, 'gaps', rows.gaps) AS row,
    FROM gaps`
  );
  if (rows.length === 0) {
    throw new CustomError('No gaps found', 404);
  }
  const gap: Gap[] = rows.map((row) => ({
    ...row,
    row: JSON.parse(row.row.toString() || '{}')
  }));
  return gap;
};

const getGap = async (id: string): Promise<Gap> => {
  const [rows] = await promisePool.execute<GetGap[]>(
    `SELECT gaps.id, gapNumber, rowId,
    JSON_OBJECT('id', whRows.id, 'rowNumber', whrows.rowNumber, 'gaps', rows.gaps) AS row,
    FROM gaps
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('Gap not found', 404);
  }
  const gap: Gap[] = rows.map((row) => ({
    ...row,
    row: JSON.parse(row.row.toString() || '{}')
  }));
  return gap[0];
};

const postGap = async (gap: PostGap) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO gaps (gapNumber, rowId, spots)
    VALUES (?, ?, ?)`,
    [gap.gapNumber, gap.rowId, gap.spots]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Gap not created', 400);
  }
  return headers.insertId;
};

const putGap = async (data: PutGap, id: number): Promise<boolean> => {
  const sql = promisePool.format('UPDATE gaps SET ? WHERE id = ?;', [data, id]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Gap not updated', 400);
  }

  return true;
};

const deleteGap = async (id: number): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM gaps
    WHERE id = ?`,
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Gap not deleted', 400);
  }

  return true;
};

export { getAllGaps, getGap, postGap, putGap, deleteGap };
