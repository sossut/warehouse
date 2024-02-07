import { RowDataPacket } from 'mysql2';
import { User } from './User';
import { Vendor } from './Vendor';

interface InDocket {
  id: number;
  docketNumber: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number | User;
  vendorId: number | Vendor;
  status: 'open' | 'closed';
  arrivedAt: Date | null;
  filename: string;
}

interface GetInDocket extends RowDataPacket, InDocket {}

type PostInDocket = Omit<InDocket, 'id'>;

type PutInDocket = Partial<PostInDocket>;

export { InDocket, GetInDocket, PostInDocket, PutInDocket };
