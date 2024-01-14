import { RowDataPacket } from 'mysql2';

interface TransportOption {
  id: number;
  transportOption: string;
}

interface GetTransportOption extends RowDataPacket, TransportOption {}

type PostTransportOption = Omit<TransportOption, 'id'>;

type PutTransportOption = Partial<PostTransportOption>;

export {
  TransportOption,
  GetTransportOption,
  PostTransportOption,
  PutTransportOption
};
