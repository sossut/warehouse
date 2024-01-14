import { RowDataPacket } from 'mysql2';
import { Gap } from './Gap';

interface Row {
  id: number;
  rowNumber: number;
  gaps: number;
  data?: Gap[];
}

interface GetRow extends RowDataPacket, Row {}

type PostRow = Omit<Row, 'id'>;

type PutRow = Partial<PostRow>;

export { Row, GetRow, PostRow, PutRow };
