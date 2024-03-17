import { RowDataPacket } from 'mysql2';

import { DaysShipmentsSentOutDocket } from './DaysShipmentsSentOutDocket';

interface DaysShipments {
  id: number;
  departedAt: Date;
  sentOutDockets: DaysShipmentsSentOutDocket[];
}

interface GetDaysShipments extends RowDataPacket, DaysShipments {}

type PostDaysShipments = Omit<DaysShipments, 'id'>;

type PutDaysShipments = Partial<PostDaysShipments>;

export { DaysShipments, GetDaysShipments, PostDaysShipments, PutDaysShipments };
