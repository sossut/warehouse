import { RowDataPacket } from 'mysql2';
import { DaysShipments } from './DaysShipments';
import { SentOutDocket } from './SentOutDocket';

interface DaysShipmentsSentOutDocket {
  id?: number;
  daysShipmentsId: number | DaysShipments;
  sentOutDocketId: number | SentOutDocket;
  sentOutDocket?: string;
}

interface GetDaysShipmentsSentOutDocket
  extends RowDataPacket,
    DaysShipmentsSentOutDocket {}

type PostDaysShipmentsSentOutDocket = Omit<DaysShipmentsSentOutDocket, 'id'>;

type PutDaysShipmentsSentOutDocket = Partial<PostDaysShipmentsSentOutDocket>;

export {
  DaysShipmentsSentOutDocket,
  GetDaysShipmentsSentOutDocket,
  PostDaysShipmentsSentOutDocket,
  PutDaysShipmentsSentOutDocket
};
