import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetPendingShipmentProduct,
  PostPendingShipmentProduct,
  PutPendingShipmentProduct,
  PendingShipmentProduct
} from '../../interfaces/PendingShipmentProduct';

const getAllPendingShipmentProducts = async (): Promise<
  PendingShipmentProduct[]
> => {
  const [rows] = await promisePool.execute<GetPendingShipmentProduct[]>(
    `SELECT *
    FROM PendingShipmentProducts`
  );
  if (rows.length === 0) {
    throw new CustomError('No PendingShipmentProducts found', 404);
  }
  return rows;
};

const getPendingShipmentProduct = async (
  id: string
): Promise<PendingShipmentProduct> => {
  const [rows] = await promisePool.execute<GetPendingShipmentProduct[]>(
    `SELECT *
    FROM PendingShipmentProducts
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('PendingShipmentProduct not found', 404);
  }
  return rows[0];
};

const getPendingShipmentProductsIdsByPendingShipmentId = async (
  id: number
): Promise<PendingShipmentProduct[]> => {
  const [rows] = await promisePool.execute<GetPendingShipmentProduct[]>(
    `SELECT id
    FROM PendingShipmentProducts
    WHERE PendingShipmentId = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('PendingShipmentProduct not found', 404);
  }
  return rows;
};

const postPendingShipmentProduct = async (
  pendingShipmentProduct: PostPendingShipmentProduct
) => {
  const sql = promisePool.format(
    `INSERT INTO PendingShipmentProducts (PendingShipmentId, productId, orderedProductQuantity, collectedProductQuantity, outDocketProductId)
    VALUES (?, ?, ?, ?, ?)`,
    [
      pendingShipmentProduct.pendingShipmentId,
      pendingShipmentProduct.productId,
      pendingShipmentProduct.orderedProductQuantity,
      pendingShipmentProduct.collectedProductQuantity,
      pendingShipmentProduct.outDocketProductId
    ]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('PendingShipmentProduct not created', 400);
  }
  return headers.insertId;
};

const putPendingShipmentProduct = async (
  data: PutPendingShipmentProduct,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format(
    'UPDATE PendingShipmentProducts SET ? WHERE id = ?;',
    [data, id]
  );
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('PendingShipmentProduct not updated', 400);
  }

  return true;
};

const deletePendingShipmentProduct = async (
  id: string
): Promise<ResultSetHeader> => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM PendingShipmentProducts WHERE id = ?',
    [id]
  );
  return result;
};

export {
  getAllPendingShipmentProducts,
  getPendingShipmentProduct,
  getPendingShipmentProductsIdsByPendingShipmentId,
  postPendingShipmentProduct,
  putPendingShipmentProduct,
  deletePendingShipmentProduct
};
