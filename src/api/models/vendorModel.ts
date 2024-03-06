import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetVendor,
  PostVendor,
  PutVendor,
  Vendor
} from '../../interfaces/Vendor';

const getAllVendors = async (): Promise<Vendor[]> => {
  const [rows] = await promisePool.execute<GetVendor[]>(
    `SELECT *
    FROM vendors`
  );
  if (rows.length === 0) {
    throw new CustomError('No vendors found', 404);
  }
  return rows;
};

const getVendor = async (id: string): Promise<Vendor> => {
  const [rows] = await promisePool.execute<GetVendor[]>(
    `SELECT *
    FROM vendors
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('Vendor not found', 404);
  }
  return rows[0];
};

const postVendor = async (vendor: PostVendor) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO vendors (name)
    VALUES (?)`,
    [vendor.name]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Vendor not created', 400);
  }
  return headers.insertId;
};

const putVendor = async (data: PutVendor, id: number): Promise<boolean> => {
  const sql = promisePool.format('UPDATE vendors SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Vendor not updated', 400);
  }

  return true;
};

const deleteVendor = async (id: number): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM vendors
    WHERE id = ?`,
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Vendor not found', 404);
  }
  return true;
};

export { getAllVendors, getVendor, postVendor, putVendor, deleteVendor };
