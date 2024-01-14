import { RowDataPacket } from 'mysql2';
import { Pallet } from './Pallet';

interface FloorSpot {
  id: number;
  palletId: number | Pallet;
}

interface GetFloorSpot extends RowDataPacket, FloorSpot {}

type PostFloorSpot = Omit<FloorSpot, 'id'>;

type PutFloorSpot = Partial<PostFloorSpot>;

export { FloorSpot, GetFloorSpot, PostFloorSpot, PutFloorSpot };
