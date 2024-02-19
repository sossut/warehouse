import { RowDataPacket } from 'mysql2';

interface SentOutDocket {
  id: number;
  docketId: number;
  transportOptionId: number;
  userId: number;
  createdAt: string;
  status: string;
  parcels: number;
}

interface GetSentOoutDocket extends RowDataPacket, SentOutDocket {}

type PostSentOutDocket = Omit<SentOutDocket, 'id'>;

type PutSentOutDocket = Partial<PostSentOutDocket>;

export {
  SentOutDocket,
  GetSentOoutDocket,
  PostSentOutDocket,
  PutSentOutDocket
};
