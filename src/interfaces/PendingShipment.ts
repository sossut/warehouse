import { RowDataPacket } from 'mysql2';
import { OutDocket } from './OutDocket';
import { TransportOption } from './TransportOption';
import { User } from './User';
import { SentOutDocketProduct } from './SentOutDocketProduct';

interface PendingShipment {
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

interface GetPendingShipment extends RowDataPacket, PendingShipment {}

type PostPendingShipment = Omit<PendingShipment, 'id' | 'createdAt'>;

type PutPendingShipment = Partial<PostPendingShipment>;

export {
  PendingShipment,
  GetPendingShipment,
  PostPendingShipment,
  PutPendingShipment
};
