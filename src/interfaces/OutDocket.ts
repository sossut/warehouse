import { RowDataPacket } from 'mysql2';
import { User } from './User';
import { TransportOption } from './TransportOption';
import { OutDocketProduct } from './OutDocketProduct';
import { Client } from './Client';

interface OutDocket {
  id: number;
  docketNumber: string;
  createdAt: Date;
  updatedAt?: Date | null | undefined;
  userId: number | User;
  clientId: number | Client;
  status: 'open' | 'closed';
  departureAt: Date | null;
  transportOptionId: number | TransportOption;
  filename: string;
  products?: OutDocketProduct[];
}

interface GetOutDocket extends RowDataPacket, OutDocket {}

type PostOutDocket = Omit<OutDocket, 'id'>;

type PutOutDocket = Partial<PostOutDocket>;

export { OutDocket, GetOutDocket, PostOutDocket, PutOutDocket };
