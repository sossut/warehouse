import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import { Row, GetRow, PostRow, PutRow } from '../../interfaces/Row';
import { GetGap } from '../../interfaces/Gap';
import { GetSpot } from '../../interfaces/Spot';
import { GetPallet } from '../../interfaces/Pallet';
import { GetProduct } from '../../interfaces/Product';
import { GetPalletProduct } from '../../interfaces/PalletProduct';

const parseNestedJSON = (obj: any): any => {
  if (typeof obj !== 'object') {
    return obj;
  }
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      try {
        obj[key] = JSON.parse(obj[key]);
      } catch (e) {
        // not a JSON string
      }
    }
    if (typeof obj[key] === 'object') {
      obj[key] = parseNestedJSON(obj[key]);
    }
  }
  return obj;
};

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
            'SELECT id, spotNumber, palletId FROM spots WHERE gapId = ?',
            [gap.id]
          );

          // For each spot, get the pallet and its products
          const spotsWithPallets = await Promise.all(
            spots.map(async (spot) => {
              const [pallets] = await promisePool.execute<GetPallet[]>(
                'SELECT id, createdAt, updatedAt FROM pallets WHERE id = ?',
                [spot.palletId]
              );
              const pallet = pallets[0];

              if (pallet) {
                const [products] = await promisePool.execute<
                  GetPalletProduct[]
                >(
                  'SELECT products.id, products.name, products.code, products.weight, palletProducts.quantity, palletProducts.palletId, palletProducts.productId FROM palletProducts LEFT JOIN products ON palletProducts.productId = products.id WHERE palletProducts.palletId = ?',
                  [pallet.id]
                );
                pallet.products = products;
              }

              return { ...spot, pallet };
            })
          );

          return { ...gap, data: spotsWithPallets };
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
