import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import { Row, GetRow, PostRow, PutRow } from '../../interfaces/Row';

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

export { getAllRows, getRow, postRow, putRow, deleteRow };
