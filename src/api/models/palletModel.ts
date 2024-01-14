import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import { GetPallet, PutPallet, Pallet } from '../../interfaces/Pallet';

const getAllPallets = async (): Promise<Pallet[]> => {
  const [rows] = await promisePool.execute<GetPallet[]>(
    `SELECT *
    FROM pallets`
  );
  if (rows.length === 0) {
    throw new CustomError('No pallets found', 404);
  }
  return rows;
};

const getPallet = async (id: string): Promise<Pallet> => {
  const [rows] = await promisePool.execute<GetPallet[]>(
    `SELECT *
    FROM pallets
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('Pallet not found', 404);
  }
  return rows[0];
};

const postPallet = async () => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO pallets ()
    VALUES ()`,
    []
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Pallet not created', 400);
  }
  return headers.insertId;
};

const putPallet = async (data: PutPallet, id: number): Promise<boolean> => {
  const sql = promisePool.format('UPDATE pallets SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Pallet not updated', 400);
  }

  return true;
};

const deletePallet = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM pallets WHERE id = ?;', [id]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Pallet not found', 404);
  }

  return true;
};

export { getAllPallets, getPallet, postPallet, putPallet, deletePallet };
