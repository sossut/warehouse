import { RowDataPacket } from 'mysql2';
import { SentOutDocketProduct } from './SentOutDocketProduct';
import { User } from './User';
import { TransportOption } from './TransportOption';
import { OutDocket } from './OutDocket';

interface SentOutDocket {
  id: number;
  docketId: number | OutDocket;
  transportOptionId: number | TransportOption;
  userId: number | User;
  createdAt: Date;
  status: 'open' | 'closed';
  parcels: number;
  departureAt: Date;
  products: SentOutDocketProduct[];
}

interface GetSentOoutDocket extends RowDataPacket, SentOutDocket {}

type PostSentOutDocket = Omit<SentOutDocket, 'id'>;

type PutSentOutDocket = Partial<PostSentOutDocket>;

export {
  SentOutDocket,
  GetSentOoutDocket,
  PostSentOutDocket,
  PutSentOutDocket
};
