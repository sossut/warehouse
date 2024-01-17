import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import { Row, GetRow, PostRow, PutRow } from '../../interfaces/Row';

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
    `SELECT 
      whrows.id, 
      whrows.rowNumber, 
      (
        SELECT 
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', gaps.id, 
              'gapNumber', gaps.gapNumber, 
              'data', (
                SELECT 
                  JSON_ARRAYAGG(
                    JSON_OBJECT(
                      'id', spots.id, 
                      'spotNumber', spots.spotNumber, 
                      'pallet', (
                        SELECT 
                          JSON_OBJECT(
                            'id', pallets.id, 
                            'createdAt', pallets.createdAt, 
                            'updatedAt', pallets.updatedAt,
                            'products', (
                              SELECT 
                                JSON_ARRAYAGG(
                                  JSON_OBJECT(
                                    'id', products.id,
                                    'name', products.name,
                                    'code', products.code,
                                    'weight', products.weight,
                                    'quantity', palletProducts.quantity
                                  )
                                )
                              FROM palletProducts
                              LEFT JOIN products ON palletProducts.productId = products.id
                              WHERE palletProducts.palletId = pallets.id
                            )
                          )
                        FROM pallets
                        WHERE pallets.id = spots.palletId
                      )
                    )
                  )
                FROM spots
                WHERE spots.gapId = gaps.id
              )
            )
          )
        FROM gaps
        WHERE gaps.rowId = whrows.id
      ) AS data
    FROM whrows`
  );
  if (rows.length === 0) {
    throw new CustomError('No rows found', 404);
  }
  const rowsWithGaps = rows.map((row) => {
    const data = JSON.parse(row.data?.toString() || '[]');
    const { gaps, ...rowWithoutGaps } = row;
    return parseNestedJSON({ ...rowWithoutGaps, data });
  });
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
