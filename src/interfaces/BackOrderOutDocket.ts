import { RowDataPacket } from 'mysql2';
import { OutDocket } from './OutDocket';
import { User } from './User';
import { Client } from './Client';

interface BackOrderOutDocket {
  id: number;
  docketId: number | OutDocket;
  createdAt: Date;
  updatedAt: Date;
  userId: number | User;
  clintId: number | Client;
  status: 'open' | 'closed';
  departureAt: Date | null;
  transportOptionId: number;
  filename: string;
}

interface GetBackOrderOutDocket extends RowDataPacket, BackOrderOutDocket {}

type PostBackOrderOutDocket = Omit<BackOrderOutDocket, 'id'>;

type PutBackOrderOutDocket = Partial<PostBackOrderOutDocket>;

export {
  BackOrderOutDocket,
  GetBackOrderOutDocket,
  PostBackOrderOutDocket,
  PutBackOrderOutDocket
};
