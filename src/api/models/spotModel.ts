import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import { Spot, GetSpot, PostSpot, PutSpot } from '../../interfaces/Spot';

const getAllSpots = async (): Promise<Spot[]> => {
  const [rows] = await promisePool.execute<GetSpot[]>(
    `SELECT 
      JSON_OBJECT(
        'id', spots.id, 
        'spotNumber', spotNumber, 
        'gapId', gapId, 
        'shelf', shelf, 
        'disabled', disabled,
        'gap', JSON_OBJECT(
          'id', gaps.id, 
          'gapNumber', gaps.gapNumber, 
          'spots', gaps.spots,
          'row', JSON_OBJECT(
            'id', whRows.id, 
            'rowNumber', whrows.rowNumber, 
            'gaps', whrows.gaps
          )
        ),
        'pallet', JSON_OBJECT(
          'id', pallets.id, 
          'createdAt', pallets.createdAt, 
          'updatedAt', pallets.updatedAt
        ),
        'products', CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
          'id', products.id,
          'name', products.name,
          'code', products.code,
          'weight', products.weight,
          'quantity', palletProducts.quantity
        )), ']')
      ) AS spot
    FROM spots
    LEFT JOIN gaps ON spots.gapId = gaps.id
    LEFT JOIN whrows ON gaps.rowId = whrows.id
    LEFT JOIN pallets ON spots.id = pallets.spotId
    LEFT JOIN palletProducts ON pallets.id = palletProducts.palletId
    LEFT JOIN products ON palletProducts.productId = products.id
    GROUP BY spots.id`
  );
  if (rows.length === 0) {
    throw new CustomError('No spots found', 404);
  }
  const spots: Spot[] = rows.map((row) => {
    const spot = JSON.parse(row.spot);
    spot.products = JSON.parse(spot.products);
    return spot;
  });
  return spots;
};

const getSpot = async (id: string): Promise<Spot> => {
  const [rows] = await promisePool.execute<GetSpot[]>(
    `SELECT 
      JSON_OBJECT(
        'id', spots.id, 
        'spotNumber', spotNumber, 
        'gapId', gapId, 
        'shelf', shelf, 
        'disabled', disabled,
        'gap', JSON_OBJECT(
          'id', gaps.id, 
          'gapNumber', gaps.gapNumber, 
          'spots', gaps.spots,
          'row', JSON_OBJECT(
            'id', whRows.id, 
            'rowNumber', whrows.rowNumber, 
            'gaps', whrows.gaps
          )
        ),
        'pallet', JSON_OBJECT(
          'id', pallets.id, 
          'createdAt', pallets.createdAt, 
          'updatedAt', pallets.updatedAt
        ),
        'products', CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
          'id', products.id,
          'name', products.name,
          'code', products.code,
          'weight', products.weight,
          'quantity', palletProducts.quantity
        )), ']')
      ) AS spot
    FROM spots
    LEFT JOIN gaps ON spots.gapId = gaps.id
    LEFT JOIN whrows ON gaps.rowId = whrows.id
    LEFT JOIN pallets ON spots.id = pallets.spotId
    LEFT JOIN palletProducts ON pallets.id = palletProducts.palletId
    LEFT JOIN products ON palletProducts.productId = products.id

    WHERE spots.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('Spot not found', 404);
  }
  const spots: Spot[] = rows.map((row) => {
    const spot = JSON.parse(row.spot);
    spot.gap = JSON.parse(spot.gap);
    spot.pallet = JSON.parse(spot.pallet);
    spot.products = JSON.parse(spot.products);
    return spot;
  });

  return spots[0];
};

const getSpotsByProductCode = async (code: string): Promise<Spot[]> => {
  const [rows] = await promisePool.execute<GetSpot[]>(
    `SELECT 
      JSON_OBJECT(
        'id', spots.id, 
        'spotNumber', spotNumber, 
        'gapId', gapId, 
        'shelf', shelf, 
        'disabled', disabled,
        'gap', JSON_OBJECT(
          'id', gaps.id, 
          'gapNumber', gaps.gapNumber, 
          'spots', gaps.spots,
          'row', JSON_OBJECT(
            'id', whRows.id, 
            'rowNumber', whrows.rowNumber, 
            'gaps', whrows.gaps
          )
        ),
        'pallet', JSON_OBJECT(
          'id', pallets.id, 
          'createdAt', pallets.createdAt, 
          'updatedAt', pallets.updatedAt
        ),
        'products', CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
          'id', products.id,
          'name', products.name,
          'code', products.code,
          'weight', products.weight,
          'quantity', palletProducts.quantity
        )), ']')
      ) AS spot
    FROM spots
    LEFT JOIN gaps ON spots.gapId = gaps.id
    LEFT JOIN whrows ON gaps.rowId = whrows.id
    LEFT JOIN pallets ON spots.id = pallets.spotId
    LEFT JOIN palletProducts ON pallets.id = palletProducts.palletId
    LEFT JOIN products ON palletProducts.productId = products.id
    WHERE products.code = ?
    GROUP BY spots.id`,
    [code]
  );
  if (rows.length === 0) {
    throw new CustomError('No spots found', 404);
  }
  const spots: Spot[] = rows.map((row) => {
    const spot = JSON.parse(row.spot);
    spot.products = JSON.parse(spot.products);
    return spot;
  });

  return spots;
};

const getSpotIdByRowGapSpot = async (
  row: number,
  gap: number,
  spot: number
): Promise<GetSpot> => {
  const [rows] = await promisePool.execute<GetSpot[]>(
    `SELECT spots.id as spotId, pallets.id as palletId
    FROM spots
    LEFT JOIN gaps ON spots.gapId = gaps.id
    LEFT JOIN whrows ON gaps.rowId = whrows.id
    LEFT JOIN pallets ON spots.id = pallets.spotId
    WHERE spotNumber = ? AND gapNumber = ? AND rowNumber = ?`,
    [spot, gap, row]
  );
  if (rows.length === 0) {
    throw new CustomError('Spot not found', 404);
  }
  console.log(rows[0]);
  return rows[0];
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

export {
  getAllSpots,
  getSpot,
  getSpotsByProductCode,
  getSpotIdByRowGapSpot,
  postSpot,
  putSpot,
  deleteSpot
};
