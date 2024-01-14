import { RowDataPacket } from 'mysql2';
import { Row } from './Row';
import { Spot } from './Spot';

interface Gap {
  id: number;
  gapNumber: number;
  spots: number;
  rowId: number | Row;
  data?: Spot[];
}

interface GetGap extends RowDataPacket, Gap {}

type PostGap = Omit<Gap, 'id'>;

type PutGap = Partial<PostGap>;

export { Gap, GetGap, PostGap, PutGap };
