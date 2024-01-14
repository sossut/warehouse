import { RowDataPacket } from 'mysql2';
import { User } from './User';
import { TransportOption } from './TransportOption';
import { DocketProduct } from './DocketProduct';

interface Docket {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number | User;
  status: 'open' | 'closed';
  departureAt: Date | null;
  transportOptionId: number | TransportOption;
  products?: DocketProduct[];
}

interface GetDocket extends RowDataPacket, Docket {}

type PostDocket = Omit<Docket, 'id'>;

type PutDocket = Partial<PostDocket>;

export { Docket, GetDocket, PostDocket, PutDocket };
