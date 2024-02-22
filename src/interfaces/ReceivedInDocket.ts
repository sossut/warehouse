import { RowDataPacket } from 'mysql2';
import { User } from './User';
import { TransportOption } from './TransportOption';
import { InDocket } from './InDocket';

interface ReceivedInDocket {
  id: number;
  docketId: number | InDocket;
  transportOptionId: number | TransportOption;
  userId: number | User;
  createdAt: Date;
  status: 'open' | 'closed';
  parcels: number;
  arrivalAt: Date;
}

interface GetReceivedInDocket extends RowDataPacket, ReceivedInDocket {}

type PostReceivedInDocket = Omit<ReceivedInDocket, 'id'>;

type PutReceivedInDocket = Partial<PostReceivedInDocket>;

export {
  ReceivedInDocket,
  GetReceivedInDocket,
  PostReceivedInDocket,
  PutReceivedInDocket
};
