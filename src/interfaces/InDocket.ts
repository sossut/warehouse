import { RowDataPacket } from 'mysql2';
import { User } from './User';
import { Vendor } from './Vendor';

interface OutDocket {
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

interface GetOutDocket extends RowDataPacket, OutDocket {}

type PostOutDocket = Omit<OutDocket, 'id'>;

type PutOutDocket = Partial<PostOutDocket>;

export { OutDocket, GetOutDocket, PostOutDocket, PutOutDocket };
