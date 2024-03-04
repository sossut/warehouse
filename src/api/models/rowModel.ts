import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import { Row, GetRow, PostRow, PutRow } from '../../interfaces/Row';
import { GetGap } from '../../interfaces/Gap';
import { GetSpot } from '../../interfaces/Spot';

const getAllRows = async (): Promise<Row[]> => {
  const [rows] = await promisePool.execute<GetRow[]>(
    `SELECT *
    FROM whrows`
  );
  if (rows.length === 0) {
    throw new CustomError('No rows found', 404);
  }
  return rows;
};

const getAllRowsGapsSpots = async (): Promise<Row[]> => {
  const [rows] = await promisePool.execute<GetRow[]>(
    'SELECT id, rowNumber FROM whrows'
  );
  const rowsWithGaps = await Promise.all(
    rows.map(async (row) => {
      const [gaps] = await promisePool.execute<GetGap[]>(
        'SELECT id, gapNumber FROM gaps WHERE rowId = ?',
        [row.id]
      );

      // For each gap, get all spots
      const gapsWithSpots = await Promise.all(
        gaps.map(async (gap) => {
          const [spots] = await promisePool.execute<GetSpot[]>(
            'SELECT id, spotNumber FROM spots WHERE gapId = ?',
            [gap.id]
          );

          return { ...gap, data: spots };
        })
      );

      return { ...row, data: gapsWithSpots };
    })
  );

  return rowsWithGaps;
};

const getRow = async (id: string): Promise<Row> => {
  const [rows] = await promisePool.execute<GetRow[]>(
    `SELECT *
    FROM whrows
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('Row not found', 404);
  }
  return rows[0];
};

const postRow = async (row: PostRow) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO whrows (rowNumber, gaps)
    VALUES (?, ?)`,
    [row.rowNumber, row.gaps]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Row not created', 400);
  }
  return headers.insertId;
};

const putRow = async (data: PutRow, id: number): Promise<boolean> => {
  const sql = promisePool.format('UPDATE rows SET ? WHERE id = ?;', [data, id]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Row not updated', 400);
  }

  return true;
};

const deleteRow = async (id: number): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM whrows
    WHERE id = ?`,
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Row not found', 404);
  }
  return true;
};

export { getAllRows, getAllRowsGapsSpots, getRow, postRow, putRow, deleteRow };
