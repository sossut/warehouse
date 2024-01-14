import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import { GetPallet, PutPallet, Pallet } from '../../interfaces/Pallet';

const getAllPallets = async (): Promise<Pallet[]> => {
  const [rows] = await promisePool.execute<GetPallet[]>(
    `SELECT 
      JSON_OBJECT('id', pallets.id, 'createdAt', pallets.createdAt, 'updatedAt', pallets.updatedAt) AS pallet,
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
          'id', products.id,
          'name', products.name,
          'code', products.code,
          'weight', products.weight,
          'quantity', palletProducts.quantity
        )), ']')
       AS products
    FROM pallets
    JOIN palletProducts ON pallets.id = palletProducts.palletId
    JOIN products ON palletProducts.productId = products.id
    GROUP BY pallets.id`
  );
  if (rows.length === 0) {
    throw new CustomError('No pallets found', 404);
  }
  const pallets = rows.map((row) => ({
    ...row,
    pallet: JSON.parse(row.pallet.toString() || '{}'),
    products: JSON.parse(row.products?.toString() || '{}')
  }));
  return pallets;
};

const getPallet = async (id: string): Promise<Pallet> => {
  const [rows] = await promisePool.execute<GetPallet[]>(
    `SELECT 
      JSON_OBJECT('id', pallets.id, 'createdAt', pallets.createdAt, 'updatedAt', pallets.updatedAt) AS pallet,
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
          'id', products.id,
          'name', products.name,
          'code', products.code,
          'weight', products.weight,
          'quantity', palletProducts.quantity
        )), ']')
       AS products
    FROM pallets
    JOIN palletProducts ON pallets.id = palletProducts.palletId
    JOIN products ON palletProducts.productId = products.id
    WHERE pallets.id = ?
    `,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('Pallet not found', 404);
  }
  const pallets = rows.map((row) => ({
    ...row,
    pallet: JSON.parse(row.pallet.toString() || '{}'),
    products: JSON.parse(row.products?.toString() || '{}')
  }));
  return pallets[0];
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
