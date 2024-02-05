import { RowDataPacket } from 'mysql2';

interface FloorSpot {
  id: number;
}

interface GetFloorSpot extends RowDataPacket, FloorSpot {}

type PostFloorSpot = Omit<FloorSpot, 'id'>;

type PutFloorSpot = Partial<PostFloorSpot>;

export { FloorSpot, GetFloorSpot, PostFloorSpot, PutFloorSpot };
