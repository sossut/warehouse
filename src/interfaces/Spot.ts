import { RowDataPacket } from 'mysql2';
import { Gap } from './Gap';

interface Spot {
  id: number;
  spotNumber: number;
  gapId: number | Gap;
  shelf: boolean;
  disabled: boolean;
  data?: Array<{
    rowNumber: number;
    gaps: number;
    data: Array<{
      gapNumber: number;
      spots: number;
      data: Array<{
        spotNumber: number;
      }>;
    }>;
  }>;
}

interface GetSpot extends RowDataPacket, Spot {}

type PostSpot = Omit<Spot, 'id'>;

type PutSpot = Partial<PostSpot>;

export { Spot, GetSpot, PostSpot, PutSpot };
