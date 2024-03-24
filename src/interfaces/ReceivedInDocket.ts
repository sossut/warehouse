import { RowDataPacket } from 'mysql2';
import { ReceivedInDocketProduct } from './ReceivedInDocketProduct';

import { InDocket } from './InDocket';
import { User } from './User';
import { Vendor } from './Vendor';

interface ReceivedInDocket {
  id: number;
  inDocketId: number | InDocket;
  arrivedAt: Date;
  createdAt: Date;
  vendor?: Vendor;
  vendorId: number | Vendor;
  userId: number | User;
  products: ReceivedInDocketProduct[];
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
