import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  Client,
  GetClient,
  PostClient,
  PutClient
} from '../../interfaces/Client';

const getAllClients = async (): Promise<Client[]> => {
  const [rows] = await promisePool.execute<GetClient[]>(
    `SELECT *
    FROM clients`
  );
  if (rows.length === 0) {
    throw new CustomError('No clients found', 404);
  }
  return rows;
};

const getClient = async (id: string): Promise<Client> => {
  const [rows] = await promisePool.execute<GetClient[]>(
    `SELECT *
    FROM clients
    WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('Client not found', 404);
  }
  return rows[0];
};

const postClient = async (client: PostClient) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO clients (name)
    VALUES (?)`,
    [client.name]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Client not created', 400);
  }
  return headers.insertId;
};

const putClient = async (data: PutClient, id: number): Promise<boolean> => {
  const sql = promisePool.format('UPDATE clients SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Client not updated', 400);
  }

  return true;
};

const deleteClient = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM clients WHERE id = ?;', [id]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Client not found', 404);
  }

  return true;
};

export { getAllClients, getClient, postClient, putClient, deleteClient };
