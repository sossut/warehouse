import { RowDataPacket } from 'mysql2';
import { SentOutDocket } from './SentOutDocket';

interface PendingShipment {
  id: number;
  sentOutDocketId: number | SentOutDocket;
  createdAt: Date;
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
